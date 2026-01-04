// ==UserScript==
// @name         VK Mod Graffiti
// @namespace    https://greasyfork.org/ru/scripts/448381-vk-mod-graffiti
// @version      0.2
// @description  Модификация графити в вк
// @author       Альберт Зарипов
// @match        https://vk.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/448381/VK%20Mod%20Graffiti.user.js
// @updateURL https://update.greasyfork.org/scripts/448381/VK%20Mod%20Graffiti.meta.js
// ==/UserScript==

(function(){

    function modGraffiti(){
        console.log('modGraffiti');

        Graffiti.initClone = Graffiti.init.bind({});
        Graffiti.init = function(){
            Graffiti.initClone();

            // задаем доп свойство слайдерам - заголовок
            for(let key in Graffiti.sliders) {
                let slider = Graffiti.sliders[key],
                    counter_wrap = document.createElement('div'),
                    counter = document.createElement('span');
                counter_wrap.style.display = "inline-block";
                counter_wrap.style.position = "relative";
                counter_wrap.innerHTML = "&nbsp;";

                counter.innerHTML = (slider.value).toFixed(2);
                counter.style.position = "absolute";
                counter_wrap.appendChild(counter);

                slider.title = slider.wrapper.closest('.graffiti_tools_section').querySelector('.graffiti_slider_caption');
                slider.title.appendChild(counter_wrap);
                slider.counter = counter;
            }

            // выбор цвета с canvas-а
            var colorPickerWrap = document.createElement('div'),
                colorPickerArea = document.createElement('div'),
                drawAreaWrapParent = Graffiti.drawAreaWrap.parentElement;
            colorPickerWrap.style.position = "relative";
            colorPickerArea.style.cssText = "display: none; position: absolute; top: 0; right: 0; bottom: 0; left: 0; cursor: crosshair;";
            colorPickerArea.addEventListener('click', canvasClick);
            colorPickerWrap.appendChild(Graffiti.drawAreaWrap);
            colorPickerWrap.appendChild(colorPickerArea);
            drawAreaWrapParent.appendChild(colorPickerWrap);
            Graffiti.myColorPickerArea = colorPickerArea;

            Graffiti.brushPreviewCanvas.removeEventListener('click', toggleColorPicker);
            Graffiti.brushPreviewCanvas.addEventListener('click', toggleColorPicker);
            Graffiti.brushPreviewCanvas.style.cursor = "pointer";

            // изменения слайдеров (толщина, интенсивность)
            if (typeof Graffiti.sliderUpdatedClone === 'undefined') {
                Graffiti.sliderUpdatedClone = Graffiti.sliderUpdated.bind({});
                Graffiti.sliderUpdated = function(e){
                    if (typeof Graffiti.sliders[e].counter !== 'undefined') {
                        Graffiti.sliders[e].counter.innerHTML = (Graffiti.sliders[e].value).toFixed(2);
                    }
                    Graffiti.sliderUpdatedClone(e);
                };
            }
        };

        function toggleColorPicker(){
            if (Graffiti.myColorPickerArea.style.display === "block") {
                Graffiti.brushPreviewCanvas.style.boxShadow = "none";
                Graffiti.myColorPickerArea.style.display = "none";
            } else {
                Graffiti.brushPreviewCanvas.style.boxShadow = "0 0 0 2px rgba(255,0,0,.5)";
                Graffiti.myColorPickerArea.style.display = "block";
            }
        }

        function canvasClick(e){
            var canvas = Graffiti.drawAreaMainCanvas;
            var canvasOffset = canvas.getBoundingClientRect();
            var canvasX = Math.floor((canvas.width / canvasOffset.width) * (e.clientX - canvasOffset.left));
            var canvasY = Math.floor((canvas.height / canvasOffset.height) * (e.clientY - canvasOffset.top));
            if (canvasX < 0 || canvasY < 0) return;

            var imageData = Graffiti.drawAreaMainContext.getImageData(canvasX, canvasY, 1, 1);
            var pixel = imageData.data;

            if (!(pixel[0] || pixel[1] || pixel[2] || pixel[3])) {
                pixel = [255,255,255,255];
            } else {
                pixel = [ pixel[0], pixel[1], pixel[2], pixel[3] ];
            }
            pixel[3] /= 255;
            pixel = rgba2rgb(pixel).join(',');

            var colorElement = document.createElement('div');
            colorElement.style.backgroundColor = "rgb("+pixel+")";
            Graffiti.colorPickerHighlight(colorElement);
            Graffiti.colorPickerChooseColor();

            Graffiti.sliderHovered = Graffiti.sliders['opacity'];
            Graffiti.sliderMove({pageX: 999999});

            toggleColorPicker();

            //Graffiti.sliders['opacity'].value = 100;
            //Graffiti.brushPreviewUpdate();
        }

        function rgba2rgb(RGBA_color, RGB_background = [255, 255, 255])
        {
            var alpha = RGBA_color[3];

            return [
                (1 - alpha) * RGB_background[0] + alpha * RGBA_color[0],
                (1 - alpha) * RGB_background[1] + alpha * RGBA_color[1],
                (1 - alpha) * RGB_background[2] + alpha * RGBA_color[2]
            ];
        }
    }

    function defineProperty(obj, propertyName, defaultValue, callback) {
        Object.defineProperty(obj, propertyName, {
            get() {
                return defaultValue;
            },
            set(v) {
                defaultValue = v;
                callback(v);
            }
        })
    }

    defineProperty(window, 'Graffiti', undefined, function(GraffitiProp){
        console.log('define');
        modGraffiti();
    });

})();


