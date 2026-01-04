// ==UserScript==
// @name         Bilibili Video Gamma Control
// @name:zh      哔哩哔哩视频 Gamma 调节器
// @name:zh-CN   哔哩哔哩视频 Gamma 调节器
// @namespace    https://github.com/HirotaZX
// @version      0.1
// @description  Add gamma adjustment to bilibili videos
// @description:zh      为哔哩哔哩视频添加 Gamma 调节功能
// @description:zh-CN   为哔哩哔哩视频添加 Gamma 调节功能
// @author       HirotaZX
// @match        *://www.bilibili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/530094/Bilibili%20Video%20Gamma%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/530094/Bilibili%20Video%20Gamma%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class VideoGammaProcessor {
        constructor(videoElement) {
            this.video = videoElement;
            this.gamma = 1.0;
            this.init();
        }

        init() {
            // 创建容器
            this.container = document.createElement('div');
            this.video.parentNode.insertBefore(this.container, this.video);
            this.container.appendChild(this.video);

            // 创建Canvas覆盖层
            this.canvas = document.createElement('canvas');
            this.canvas.style.position = 'absolute';
            this.canvas.style.left = 0;
            this.canvas.style.top = 0;
            this.canvas.style.width = "100%";
            this.container.appendChild(this.canvas);

            // 初始化WebGL
            this.gl = this.canvas.getContext('webgl', { preserveDrawingBuffer: true });
            this.initWebGL();

            // 创建控制面板
            this.createControls();

            // 启动渲染循环
            this.rafCallback();
        }

        initWebGL() {
            const gl = this.gl;

            // 顶点着色器
            const vertShader = gl.createShader(gl.VERTEX_SHADER);
            gl.shaderSource(vertShader, `
    attribute vec2 position;
    varying vec2 vTexCoord;

    void main() {
        gl_Position = vec4(position, 0.0, 1.0);
        vTexCoord = vec2(
            position.x * 0.5 + 0.5,  // X保持原样
            1.0 - (position.y * 0.5 + 0.5)  // Y坐标翻转
        );
    }
            `);
            gl.compileShader(vertShader);

            // 片段着色器
            const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
            gl.shaderSource(fragShader, `
                precision highp float;
                varying vec2 vTexCoord;
                uniform sampler2D uTexture;
                uniform float uGamma;

                void main() {
                    vec4 color = texture2D(uTexture, vTexCoord);
                    float invGamma = 1.0 / uGamma;
                    gl_FragColor = vec4(pow(color.rgb, vec3(invGamma)), color.a);
                }
            `);
            gl.compileShader(fragShader);

            // 创建程序
            this.program = gl.createProgram();
            gl.attachShader(this.program, vertShader);
            gl.attachShader(this.program, fragShader);
            gl.linkProgram(this.program);

            // 创建缓冲区
            const buffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
                -1, -1, 1, -1, -1, 1,
                -1, 1, 1, -1, 1, 1
            ]), gl.STATIC_DRAW);

            // 初始化纹理
            this.texture = gl.createTexture();
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        }

        createControls() {
            // 创建控制面板
            const panel = document.createElement('div');
            panel.style.position = 'absolute';
            panel.style.top = '50px';
            panel.style.left = '10px';
            panel.style.background = 'rgba(0,0,0,0.7)';
            panel.style.padding = '5px';
            panel.style.color = 'white';

            // Gamma滑动条
            panel.innerHTML = `
                <label>Gamma: </label>
                <input type="range" min="0.1" max="4.0" step="0.1" value="1.0">
                <span class="value">1.0</span>
            `;

            const input = panel.querySelector('input');
            input.addEventListener('input', e => {
                e.preventDefault();

                this.gamma = parseFloat(e.target.value);
                panel.querySelector('.value').textContent = e.target.value;
            });

            // 添加重置按钮
            const resetBtn = document.createElement('button');
            resetBtn.textContent = '重置';
            resetBtn.style.marginLeft = '10px';
            panel.appendChild(resetBtn);

            // 重置功能实现
            resetBtn.addEventListener('click', e => {
                e.preventDefault();

                input.value = 1.0;
                this.gamma = 1.0;
                panel.querySelector('.value').textContent = 1;
            });

            // 添加截图按钮
            const screenshotBtn = document.createElement('button');
            screenshotBtn.textContent = '截图保存';
            screenshotBtn.style.marginLeft = '10px';
            panel.appendChild(screenshotBtn);

            // 截图功能实现
            screenshotBtn.addEventListener('click', e => {
                e.preventDefault();

                // 生成文件名
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `screenshot-${timestamp}.png`;

                // 触发下载
                const link = document.createElement('a');
                link.download = filename;
                link.href = this.canvas.toDataURL('image/png');
                link.click();
            });

            // 阻止事件冒泡
            panel.addEventListener('click', e => {
                e.stopPropagation();
            });

            this.container.appendChild(panel);
        }

        updateTexture() {
            const gl = this.gl;
            gl.bindTexture(gl.TEXTURE_2D, this.texture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, this.video);
        }

        render() {
            const gl = this.gl;

            if(this.video.readyState < 2) return;

            // 更新Canvas尺寸
            if(this.canvas.width !== this.video.videoWidth ||
               this.canvas.height !== this.video.videoHeight) {
                this.canvas.width = this.video.videoWidth;
                this.canvas.height = this.video.videoHeight;
                gl.viewport(0, 0, this.canvas.width, this.canvas.height);
            }

            this.updateTexture();

            gl.useProgram(this.program);

            // 设置属性
            const positionLoc = gl.getAttribLocation(this.program, 'position');
            gl.enableVertexAttribArray(positionLoc);
            gl.bindBuffer(gl.ARRAY_BUFFER, gl.getParameter(gl.ARRAY_BUFFER_BINDING));
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

            // 设置uniform
            gl.uniform1f(gl.getUniformLocation(this.program, 'uGamma'), this.gamma);
            gl.uniform1i(gl.getUniformLocation(this.program, 'uTexture'), 0);

            // 绘制
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        }

        rafCallback() {
            // if(!this.video.paused) {
                this.render();
            // }
            requestAnimationFrame(() => this.rafCallback());
        }
    }

    // 自动检测视频元素
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if(node.tagName === 'VIDEO') {
                    if(!node.dataset.gammaProcessed) {
                        node.dataset.gammaProcessed = true;
                        new VideoGammaProcessor(node);
                    }
                } else if(node.querySelectorAll) {
                    node.querySelectorAll('video').forEach(video => {
                        if(!video.dataset.gammaProcessed) {
                            video.dataset.gammaProcessed = true;
                            new VideoGammaProcessor(video);
                        }
                    });
                }
            });
        });
    });

    observer.observe(document.getElementById('bilibili-player'), {
        childList: true,
        subtree: true
    });

    // 处理已有视频
    document.querySelectorAll('video').forEach(video => {
        if(!video.dataset.gammaProcessed) {
            video.dataset.gammaProcessed = true;
            new VideoGammaProcessor(video);
        }
    });
})();