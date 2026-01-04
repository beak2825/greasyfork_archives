
// ==UserScript==
// @name         TestVeryengineObj
// @namespace    https://editor.veryengine.cn/
// @version      0.1
// @description  veryengine 框架下 babylon物体查询脚本
// @author       ykyu
// @match        https://editor.veryengine.cn/editor/*
// @match        https://editor.veryengine.cn/publish/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447058/TestVeryengineObj.user.js
// @updateURL https://update.greasyfork.org/scripts/447058/TestVeryengineObj.meta.js
// ==/UserScript==
(function () {
    'use strict';
    console.log("ctrl + m 开启查询")

    let curPanle = null;
    let curInput = null;
    let targetStr = "";
    let moveOk = false;
    let moveX = 0,
        moveY = 0

    let InitPanel = () => {
        let baseTextDiv = document.createElement("div");
        baseTextDiv.id = "baseDiv"
        baseTextDiv.style.position = "fixed"
        // baseTextDiv.style.background = "black";
        baseTextDiv.style.width = "42%";
        baseTextDiv.style.height = "40px";
        baseTextDiv.style.opacity = "1";
        baseTextDiv.style.top = "10px";
        baseTextDiv.style.left = "58%";
        baseTextDiv.style.display = "flex"

        let mTextInput = document.createElement("input");
        mTextInput.type = "text";
        mTextInput.name = "text";
        mTextInput.placeholder = "Ctrl+c复制内容或者直接输入内容查询，F12查看结果";
        mTextInput.style.fontSize = "16px";
        mTextInput.style.width = "88%";
        mTextInput.style.height = "70%";
        mTextInput.style.marginTop = "5px";
        mTextInput.style.marginLeft = "6px";
        mTextInput.style.borderLeft = "0px";
        mTextInput.style.borderRight = "0px";
        mTextInput.style.borderTop = "0px";
        mTextInput.style.borderBottom = "1px solid #dbdbdb";



        mTextInput.style.padding = "0";
        mTextInput.style.outlineStyle = "none";

        curInput = mTextInput;

        let inputParent = document.createElement("div");
        inputParent.id = "inputParent"

        inputParent.style.width = "86%";
        inputParent.style.height = "40px";
        inputParent.style.marginTop = "2px";
        inputParent.style.background = "#ffffff";
        inputParent.style.borderRadius = "6px";

        let searchBtn = document.createElement("button");
        searchBtn.id = "searchBtn"

        searchBtn.style.width = "10%";
        searchBtn.style.height = "100%";
        searchBtn.style.padding = "0"
        searchBtn.style.outlineStyle = "none"
        searchBtn.style.borderWidth = "0"
        searchBtn.innerText = "查询"
        searchBtn.style.opacity = "0.6"
        searchBtn.style.background = "#ffffff";
        searchBtn.onclick = getData;
        searchBtn.onmouseover = () => {
            searchBtn.style.opacity = "1"
        }
        searchBtn.onmouseout = () => {
            searchBtn.style.opacity = "0.6"
        }

        searchBtn.onmouseover = () => {
            searchBtn.style.opacity = "1"
        }
        searchBtn.onmouseout = () => {
            searchBtn.style.opacity = "0.6"
        }
        searchBtn.onmouseup = () => {
            searchBtn.style.opacity = "0.6"
        }
        searchBtn.onmousedown = () => {
            searchBtn.style.opacity = "1"
        }
        inputParent.appendChild(mTextInput)
        inputParent.appendChild(searchBtn)


        let dragBtn = document.createElement("div");
        dragBtn.id = "dragBtn"
        dragBtn.style.width = "4%";
        dragBtn.style.height = "40px";
        dragBtn.style.marginTop = "2px";
        dragBtn.style.background = "#000000";
        dragBtn.style.borderRadius = "6px";
        dragBtn.style.fontSize = "12px";
        dragBtn.style.textAlign = "center";
        dragBtn.style.color = "#ffffff";
        dragBtn.innerText = "拖动"

        baseTextDiv.appendChild(dragBtn);

        baseTextDiv.appendChild(inputParent);

        mTextInput.onchange = (source) => {
            //读取数据
            // console.log("数值1：", source.target)
            // console.log("数值2：", source.target.value)
            targetStr = source.target.value;
            getData();
        }

        let closeBtnParent = document.createElement("div");
        closeBtnParent.id = "closeBtnParent"
        closeBtnParent.style.width = "10%";
        closeBtnParent.style.height = "40px";
        closeBtnParent.style.marginTop = "2px";
        closeBtnParent.style.background = "#ffffff";
        closeBtnParent.style.borderRadius = "6px";
        // closeBtnParent.style.display = "inline-block";

        let closeBtn = document.createElement("button");
        closeBtn.id = "closeBtn"

        closeBtn.style.width = "100%";
        closeBtn.style.height = "100%";
        closeBtn.style.padding = "0"
        closeBtn.style.outlineStyle = "none"
        closeBtn.style.borderWidth = "0"
        closeBtn.style.background = "#ffffff"
        closeBtn.innerText = "关闭"
        closeBtn.style.opacity = "0.6"
        closeBtn.style.borderRadius = "6px";

        closeBtn.onclick = closePanel;
        closeBtn.onmouseover = () => {
            closeBtn.style.opacity = "1"
        }
        closeBtn.onmouseout = () => {
            closeBtn.style.opacity = "0.6"
        }
        closeBtn.onmouseup = () => {
            closeBtn.style.opacity = "0.6"
        }
        closeBtn.onmousedown = () => {
            closeBtn.style.opacity = "1"
        }
        closeBtnParent.appendChild(closeBtn);
        baseTextDiv.appendChild(closeBtnParent);
        curPanle = baseTextDiv;
        document.body.appendChild(curPanle);



        dragBtn.onmousedown = function (e) {
            moveX = e.pageX - curPanle.offsetLeft
            moveY = e.pageY - curPanle.offsetTop
            moveOk = true
        }
        dragBtn.onmouseup = function () {
            moveOk = false
        }
        dragBtn.onblur = function () {
            moveOk = false
        }
        // dragBtn.onmousemove = function (e) {
        //     e.preventDefault();

        // }

    }

    window.onmouseup = function () {
        moveOk = false
    }
    window.onmousemove = function (e) {
        if (moveOk) {
            curPanle.style.left = e.pageX - moveX + 'px'
            curPanle.style.top = e.pageY - moveY + 'px'
        }
    }

    // let curInputValue = "";
    document.onkeydown = function (event) {
        // console.log("KEY:::  ", event.key)
        if (event.ctrlKey) {
            switch (event.key.toLowerCase()) {
                case 'm':
                    if (curInput != null) {
                        curPanle.style.left = "10px";
                        curPanle.style.top = "58%";
                        // closePanel();
                        curInput.focus();
                        curInput.select();
                    } else {
                        InitPanel();
                        curInput.focus();
                        curInput.select();
                    }
                    break;
                case 'c':
                    setTimeout(() => {
                        if (curInput != null) {
                            // closePanel();
                            curInput.focus();
                            curInput.select();
                        }
                    }, 100);
                    break;
                default:
                    break;
            }
        }

    }

    document.addEventListener('copy', function (event) {
        let clipboardData = event.clipboardData || window.clipboardData;
        // clipboardData.setData('text/plain', text);
        // event.preventDefault();
        if (!clipboardData) {
            return;
        }
        setTimeout(() => {
            if (curInput != null && event.target.value && event.target.value.length > 0) {
                // closePanel();
                targetStr = event.target.value;
                curInput.value = targetStr;
                curInput.focus();
                curInput.select();
                getData();
            }
        }, 50);
    });


    function closePanel() {
        curInput = null;
        document.body.removeChild(curPanle);
    }

    function getData() {
        try {
            let engines = BABYLON.Engine.Instances;
            // console.log("engine 数量：  ", engines.length)
            for (let z = 0; z < engines.length; z++) {
                const engine = engines[z];
                // console.log("scene 数量：  ", engine.scenes.length)
                for (let i = 0; i < engine.scenes.length; i++) {
                    const scene = engine.scenes[i];
                    // console['group']("scene：  ", i, scene.name)
                    GetAllNode(scene)
                    GetAllControl(scene)
                    // console["groupEnd"]()
                }
            }
        } catch (error) {

        }
    }

    function GetAllNode(scene) {
        let nodes = scene.getNodes();
        // console.log("场景中物体的数量： ", nodes.length)
        for (let j = 0; j < nodes.length; j++) {
            const element = nodes[j];
            if (element instanceof BABYLON.TransformNode) {
                // if (element.name === "立方体111") {
                //     console['group']("node name:", element.name)
                //     console.log("相对坐标：", element.position)
                //     console.log("绝对坐标：", element.absolutePosition)
                //     console.log("旋转值：", element.rotation)
                //     console.log("缩放值：", element.scaling)

                //     element.position = new BABYLON.Vector3(100, 100, 100)
                //     console.log("改变之后的相对坐标：", element.position)
                //     console["groupEnd"]()
                // } else {
                //     console.log("node name:", element.name)
                // }
                if (element.name === targetStr) {
                    GetTransformNodeDate(element);
                }
            } else {
                // console.log("node name:", element.name)
            }

        }
    }
    let pathTab =[];
    function GetAllControl(scene) {
        pathTab =[];
        for (let i = 0; i < scene.textures.length; i++) {
            const element = scene.textures[i];
            // console.log("       元素名称：",element.name,"序号：",i,element)
            if (element instanceof BABYLON.GUI.AdvancedDynamicTexture) {
                // console.log("UI元素     control name：", element.rootContainer.name);
                GetControl(element.rootContainer);
            }
        }
        if (pathTab.length > 0) {
            let str = pathTab[0];
            console['group']("control path:%c\t" + str, 'color:#ff0;')
            console.log("%c设置GUI激活%c, " + str + "，true", 'color:#0f0;', 'color:#fff;')
            console.log("获取GUI位置, " + str + "，vector2, (200,40)" )
            console.log("设置GUI位置, " + str + "，vector2, (200,40)" )

            console.log("设置GUI透明度,  %s, 0.5, " , str)

            console.log("设置GUI旋转角度, " + str + "，*旋转角度")
            console.log("GUI拖拽, %s, *允许拖拽, " , str )

            console['group']("%cGUI动画", 'color:#0f0;')
            console.log("%cGUI动画 %c几乎全为在 %c原有值基础%c 上增量改变，即（%c原有值+填写值%c）", 'color:#ff0;','color:#fff;', 'color:#ff0;', 'color:#fff;')

            console.log("GUI动画, " + str + "，平移，（100,100），3")
            console.log("GUI动画, " + str + "，旋转，45，3")
            console.log("GUI动画, " + str + "，透明,-0.5,3")
            console.log("GUI动画, " + str + "，缩放,(2,0.5),3")
            console.log("GUI动画, " + str + "，背景色,(-255,0,0),3")
            console.log("GUI动画, " + str + "，平移，（100,100），3，3，悠悠，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，3，增强，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，3，重复，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，1，开关，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，-1，悠悠，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，-1，增强，InQuad")
            console.log("GUI动画, " + str + "，平移，（100,100），3，-1，重复，InQuad")
            console["groupEnd"]()

            console["groupEnd"]()

            if (pathTab.length > 1) {
                console['group']("%c control path all", 'color:#0f0;')
                for (let i = 0; i < pathTab.length; i++) {
                    const curPath = pathTab[i];
                    if (i % 2 === 0) {
                        console.log("%c"+curPath, 'color:#0f0;')
                    }else{
                        console.log(curPath)
                    }
                   
                }
                console["groupEnd"]()
            }
           
        }
    }

    function GetControl(control) {
        for (let i = 0; i < control.children.length; i++) {
            const child = control.children[i];
            if (child.name === targetStr) {
                let str = child.name;
                let cont = child;
                while (cont.parent) {
                    str = cont.parent.name + "." + str;
                    cont = cont.parent;
                }
                pathTab.push(str);
            }
            if (child instanceof BABYLON.GUI.Container) {
                GetControl(child);
            }
        }
    }


    function GetTransformNodeDate(node) {
        console['group']("node name:%c" + node.name, 'color:#0f0;')
        console.log("相对：\t%c" + GetVector3Str(node.position), 'color:#0f0;')
        console.log("绝对：\t%c" + GetVector3Str(node.absolutePosition), 'color:#0f0;')
        console.log("旋转：\t%c" + GetVector3Str(node.rotation), 'color:#0f0;')
        console.log("缩放：\t%c" + GetVector3Str(node.scaling), 'color:#0f0;')


        console.log("设置激活, true，" + node.name)

        console['group']("获取位置, %s, world, vector3, *%s位置", node.name, node.name)
        console.log("获取位置, %s, self, vector3, *%s位置", node.name, node.name)
        console.log("获取位置, %s, world, vector3, %s", node.name, GetVector3Str(node.position))
        console.log("获取位置, %s, self, vector3, %s", node.name, GetVector3Str(node.position))

        console.log("设置位置, %s, world, vector3, *%s位置", node.name, node.name)
        console.log("设置位置, %s, self, vector3, *%s位置", node.name, node.name)
        console.log("设置位置, %s, world, vector3, %s", node.name, GetVector3Str(node.position))
        console.log("设置位置, %s, self, vector3, %s", node.name, GetVector3Str(node.position))
        console["groupEnd"]()


        console['group']("获取角度, %s, self, vector3, *%s角度", node.name, node.name)
        console.log("获取角度, %s, world, vector3, *%s角度", node.name, node.name)
       
        console.log("设置角度, %s, self, vector3, *%s角度", node.name, node.name)
        console.log("设置角度, %s, world, vector3, *%s角度", node.name, node.name)
        
        console["groupEnd"]()

        console['group']("设置父物体, %s, *parent_name", node.name)
        console.log("%c是否重设父物体,bool,true       %cfalse 时执行响应 设置为默认父物体" ,'color:#0f0;','color:#ff0;')
        console.log("设置父物体, %s, *parent_name , *是否恢复原父物体", node.name)

        console["groupEnd"]()


        console['group']("运动")
       
        console.log("直线运动, %s, （0, 60, 0）, self, true", node.name)
        console.log("一代平移运动, %s, (20,0,0), 10, 自身", node.name)
        console.log("一代旋转运动, %s, (1,0,0), 10, 45, 自身", node.name)
        console.log("一代平移加旋转运动, %s, (20,0,0), 10, （1,0,0），10, 45", node.name)
        console.log("一代任意移动运动, %s, 50, 10, 参考物体名, (0, 120, 0), (0, 45, 0)", node.name)
        console.log("一代瞬间移动, %s, 参考物体名, (0, 120, 0), (0, 45, 0)", node.name)
        console.log("一代时间控制任意移动运动, %s, 5, 参考物体名, (0, 120, 0), (0, 45, 0)", node.name)

        console["groupEnd"]()


        console["groupEnd"]()
    }

    function GetVector3Str(vector3Value) {
        return "(" + vector3Value.x + "," + vector3Value.y + "," + vector3Value.z + ")";
    }


})();