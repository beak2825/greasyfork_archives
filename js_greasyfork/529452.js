// ==UserScript==
// @name         CocosNodeTree-Bluem
// @namespace    http://tampermonkey.net/
// @version      2024-06-27
// @description  try to take over the world!
// @author       bluem
// @match        http://localhost*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.localhost
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529452/CocosNodeTree-Bluem.user.js
// @updateURL https://update.greasyfork.org/scripts/529452/CocosNodeTree-Bluem.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    console.log("monkey start")

    let app = document.createElement("div");
    app.id = "app_BM";
    document.querySelector('body').append(app);
    app.innerHTML += `
    <div id="appScreen" style="position:fixed;left:0px;top:0px;width:100%;height:100%" hidden></div>
    <div id="nodeTreeMenu" style="
    position:fixed;
    left:100px;
    top:100px;
    width:50px;
    height:50px;
    z-index:1000;

    ">
        <div id="nodeTreeMenuPoint", style="

            padding-top:13px;
            font-size:13px;
            text-align:center;
            font-weight:bold;
            color:white;
            background-color: rgb(50,50,50);
            border: 2px solid rgba(255,255,255,0.8);
            border-radius:25px;
            width:50px;
            height:50px;

        ">节点树</div>
        <div id="nodeTreeBoard", style="

            width:300px;
            height:700px;
            background-color:rgba(0, 0, 0, 0.9);
            position: relative;

        " hidden>
            <div id="openListBtn" title="展开/收起全部" style="
                position: absolute;right: 20px;bottom: calc(100% + 7px);cursor: pointer;
                width: 25;height: 25;background-color: black;border-radius: 5px;text-align: center;color: white;border: 1px solid white;
            ">〼</div>
            <div id="refreshBtn" title="刷新" style="
                position: absolute;right: 55px;bottom: calc(100% + 7px);cursor: pointer;font-size: 13;padding-top: 2;
                width: 50;height: 25;background-color: black;border-radius: 5px;text-align: center;color: white;border: 1px solid white;
            ">刷新</div>
            <div id="cocosNodeList" style="width:100%;height:100%;color:white;overflow: scroll;overflow-x: hidden;-ms-overflow-style: none;scrollbar-width: none;">
                <div style="height:1px"></div>
                <div class="cocosNode" style="width:calc(100% - 10px);height:30px;background-color:rgba(50,50,50);
                    padding-top: 4px;padding-left: 10px;margin: 5px;position: relative;
                ">
                    <a class="cocosNodeName">Canvas</a>
                    <div class="childrenBtn" style="width: 30;height: 22;background-color: gray;position: absolute;right: 5;top: 4;border-radius: 5px;"></div>
                </div>
            </div>
            <div id="cocosNodeInfoBoard" hidden style="
                width:100%;height:100%;
                position:absolute;left:calc(3px + 100%);top:0px;
                background-color:rgba(0, 0, 0, 0.9);
                overflow-x: hidden;overflow-y: scroll;
                -ms-overflow-style: none;scrollbar-width: none;
            ">
                <div style="background-color: #ffffff33;
                    width: calc(100% - 10px);margin: 5;border-radius: 5px;
                    color: white;
                ">
                    <div style="height:1"></div>
                    <div id="nodeInfo_active" style="cursor: pointer;display: inline-block;border: 2px solid white;width: 25;height: 25;text-align: center;background-color: gray;margin: 4;">√</div>
                    <a id="nodeInfo_name" style="display: inline-block;">Node</a>
                    <div id="nodeInfo_printBtn" title="打印" style="
                        display: inline-block;float: right;background-color: gray;cursor: pointer;
                        width: 25;height: 25;text-align: center;border-radius: 5px;margin: 4;
                    ">☛</div>
                    <div id="nodeInfo_showBtn" title="凸显" style="
                        display: inline-block;float: right;background-color: gray;cursor: pointer;
                        width: 25;height: 25;text-align: center;border-radius: 5px;margin: 4;
                    ">☀</div>
                    <textarea class="nodeInfo_url" spellcheck="false" style="font-size:10;resize:none;background-color: gray;width: calc(100% - 10px);height: 25;margin-left: 5;border-radius: 5px;padding-left: 10;padding-right: 10;">Canvas/bg</textarea>
                    <div id="nodeInfo_nodeInfo" style="text-align: center;">
                        <div style="width: 100;height: 25;border: 1px solid gray;margin: 5;display: inline-block;float: left;">x</div>
                        <textarea id="nodeInfo_txt_x" style="resize:none;display: inline-block;width: calc(100% - 115px);border: 1px solid gray;height: 25;margin: 5;margin-left: 0;text-align: center;">0</textarea>
                    </div>
                </div>
                <div id="nodeInfo_componentList" style="color:white;">
                    <div class="nodeInfo_component" style="width:calc(100% - 10px);background-color: #ffffff33;border-radius: 5px;margin: 5;">
                        <div class="nodeInfo_component_enabled" style="display: inline-block;border: 2px solid white;width: 25;height: 25;text-align: center;background-color: gray;margin: 4;">√</div>
                        <a class="nodeInfo_component_name">cc.Sprite</a>
                        <div id="nodeInfo_printBtn" style="
                            display: inline-block;float: right;background-color: gray;
                            width: 25;height: 25;text-align: center;border-radius: 5px;margin: 4;
                        ">☛</div>
                    </div>
                    <div class="nodeInfo_component" style="width:calc(100% - 10px);background-color: #ffffff33;border-radius: 5px;margin: 5;">
                        <div class="nodeInfo_component_enabled" style="display: inline-block;border: 2px solid white;width: 25;height: 25;text-align: center;background-color: gray;margin: 4;">√</div>
                        <a class="nodeInfo_component_name">cc.Sprite</a>
                        <div id="nodeInfo_printBtn" style="
                            display: inline-block;float: right;background-color: gray;
                            width: 25;height: 25;text-align: center;border-radius: 5px;margin: 4;
                        ">☛</div>
                    </div>
                </div>
            </div>

        </div>

    </div>
    `;
    console.log(app)
    app = document.getElementById("appScreen");

    let menu = document.getElementById("nodeTreeMenu");
    let menuPoint = document.getElementById("nodeTreeMenuPoint");
    let treeBoard = document.getElementById("nodeTreeBoard");
    let nodeList = document.getElementById("cocosNodeList");
    let openListBtn = document.getElementById("openListBtn");
    let nodeInfoBoard = document.getElementById("cocosNodeInfoBoard");
    let nodeInfoList = document.getElementById("nodeInfo_nodeInfo");
    let componentList = document.getElementById("nodeInfo_componentList");
    menuInit();

    let tree = {}//节点树
    /**
    setInterval(()=>{
        if(!showing){return}
        if(moving){return}
        updateNodeList();
    });
    /**/


    let moving = false;
    function menuInit(){//菜单的初始化
        let lastX = 0,lastY = 0;
        let moved = false;
        menuPoint.onmousedown = (e)=>{//按下
            lastX = e.x;
            lastY = e.y;
            moving = true;
            moved = false;

            app.hidden = false;
        }
        let moveFunc = (e)=>{//移动
            if(!moving){return}
            let dx = e.x - lastX, dy = e.y - lastY;
            menu.style.left = Math.max(dx + parseInt(menu.style.left)) + "px";
            menu.style.top = Math.max(dy + parseInt(menu.style.top)) + "px";
            lastX = e.x;
            lastY = e.y;
            if(Math.abs(dx)+Math.abs(dy)>1){
                moved = true;
            }
        }
        app.onmousemove = (e)=>{moveFunc(e)}
        menuPoint.onmousemove = (e)=>{moveFunc(e)}
        nodeList.onmousemove = (e)=>{moveFunc(e)}
        let upFunc = (e)=>{//弹起
            moving = false;
            app.hidden = true;
        }
        app.onmouseup = (e)=>{upFunc(e)}
        menuPoint.onmouseup = (e)=>{upFunc(e)}
        menuPoint.onclick = ()=>{
            if(moved){return}
            changeMenuShow();
            console.log()
            menu.style.left = Math.max(parseInt(menu.style.left), 0);
            menu.style.top = Math.max(parseInt(menu.style.top), 0);
            ignoreErr();
        }

        openListBtn.onclick = (e)=>{
            openList();
        }
        document.getElementById("refreshBtn").onclick = (e)=>{
            createNodeList();
            showNodeInfo(currentNode?currentNode.node:null);
        }
    }
    let showing = false;
    function changeMenuShow(){//改变菜单显示状态
        showing = !showing;
        treeBoard.hidden = !showing;
        if(showing){
            showMenu();


            menuPoint.style.borderBottomLeftRadius = "0";
            menuPoint.style.borderBottomRightRadius = "0";
            menuPoint.style.height = 40;
            menuPoint.style.width = 300;
            menuPoint.style.paddingTop = 9;
        }else{

            menuPoint.style.borderBottomLeftRadius = "25px";
            menuPoint.style.borderBottomRightRadius = "25px";
            menuPoint.style.height = 50;
            menuPoint.style.width = 50;
            menuPoint.style.paddingTop = 13;
        }
    }
    function showMenu(){//显示菜单

        let scene = cc.director.getScene();
        console.log(scene);

        createNodeList();

    }
    let root = null;
    function createNodeList(){
        nodeList.innerHTML = `<div style="height:1px;margin:4px"></div>`;
        let scene = cc.director.getScene();

        root = nodeAddToTree(scene, 0);
    }
    function updateNodeList(){//刷新节点树
        let scene = cc.director.getScene();

        if(!checkSameNodeTree(root, scene)){//节点树是否有变化
            console.log("update create tree")
            createNodeList();
            showNodeInfo(currentNode&&currentNode.node?currentNode.node:null);
        }else{//当前节点是否有变化
            if(currentNode){
                if(!checkSameNodeInfo()){
                    showNodeInfo(currentNode?currentNode.node:null);
                }
            }
        }
    }
    function checkSameNodeTree(htmlNode, cocosNode){
        if(!htmlNode || !cocosNode || !htmlNode.node){return false}
        if(htmlNode.node != cocosNode){return false}
        if(htmlNode.childrenList.length != cocosNode.children.length){return false}
        if(htmlNode!=root && htmlNode.getElementsByClassName("cocosNodeName")[0].active != cocosNode.active){return false}
        for(let i = 0; i < htmlNode.childrenList.length; i += 1){
            if(!checkSameNodeTree(htmlNode.childrenList[i], cocosNode.children[i])){return false}
        }
        return true
    }
    let currentNode = null;//当前节点
    function nodeAddToTree(node, lv){//节点加到树上
        lv = parseInt(lv)

        let newNode = document.createElement("div");
        newNode.class = "cocosNode";
        newNode.style = `float:right;width:calc(100% - 10px);height:22;background-color:rgba(70,70,70);padding-left: 30px;margin: 5px;margin-top:1;margin-bottom:1;position: relative;`;
        newNode.innerHTML = `<a class="cocosNodeName" style="font-size: 15;">Canvas</a>
<div class="childrenBtn" style="cursor: pointer;font-size: 11;text-align:center;width: 18;height: 18;background-color: gray;position: absolute;left: 5;top: 2;border-radius: 5px;">
▲</div>`;
        nodeList.append(newNode);
        newNode.style.borderLeft = 20*lv + "px solid rgb(30,30,30)"
        newNode.style.marginTop = 0;
        newNode.getElementsByClassName("cocosNodeName")[0].style.color = (!lv||node.active)?"white":"gray";
        newNode.getElementsByClassName("cocosNodeName")[0].active = (!lv||node.active)
        newNode.getElementsByClassName("cocosNodeName")[0].innerHTML = node.name;

        let clickHide = false;
        newNode.getElementsByClassName("childrenBtn")[0].onclick = (e)=>{
            clickHide = false;
            newNode.childrenList.forEach((child, i)=>{
                child.hide(newNode.showingList);
            })
            newNode.showingList = !newNode.showingList;
            newNode.getElementsByClassName("childrenBtn")[0].innerHTML = newNode.showingList?"▲":"▼";
            node.hidingChildrenList = !newNode.showingList;
        }
        newNode.getElementsByClassName("childrenBtn")[0].onmouseup = ()=>{
            clickHide = true;
        }
        newNode.hide = (ifHide, ifSet = false)=>{
            if(ifHide){//隐藏
                newNode.hidden=true;
                if(ifSet){
                    newNode.showingList = false;
                    newNode.getElementsByClassName("childrenBtn")[0].innerHTML = newNode.showingList?"▲":"▼";
                    node.hidingChildrenList = true;
                }
                newNode.childrenList.forEach((child, i)=>{
                    child.hide(ifHide, ifSet);
                })
            }else{//显示
                newNode.hidden=false;
                if(ifSet){
                    newNode.showingList = true;
                    newNode.getElementsByClassName("childrenBtn")[0].innerHTML = newNode.showingList?"▲":"▼";
                    node.hidingChildrenList = false;
                }
                if(newNode.showingList){//展开中
                    newNode.childrenList.forEach((child, i)=>{
                        child.hide(ifHide, ifSet);
                    })
                }
            }
            if(lv==0){
                newNode.hidden=false;
            }
        }
        newNode.showingList = true;//展开中
        newNode.node = node;
        newNode.onmouseup = (e)=>{//点击节点详情
            if(clickHide){return}

            showNodeInfo(newNode.node)
            if(currentNode){
                currentNode.style.backgroundColor = "rgb(70, 70, 70)";
            }
            currentNode = newNode;
            currentNode.style.backgroundColor = "skyblue";
        }


        newNode.childrenList = [];
        if(node.children && node.children.length>0){
            node.children.forEach((child, i)=>{
                let n = nodeAddToTree(child, lv+1);
                newNode.childrenList.push(n);
                n.getElementsByClassName("cocosNodeName")[0].style.color =
                    ((newNode.getElementsByClassName("cocosNodeName")[0].style.color=="white")&&n.node.active)?"white":"gray";
            })
        }
        if(newNode.childrenList.length==0){//没有子节点
            newNode.getElementsByClassName("childrenBtn")[0].hidden = true
        }

        if(currentNode && currentNode.node && currentNode.node==node){
            newNode.style.backgroundColor = "skyblue";
            currentNode = newNode;
        }
        if(node.hidingChildrenList){//正在收起
            newNode.getElementsByClassName("childrenBtn")[0].click();
        }
        return newNode;
    }
    function openList(){//展开节点树
        root.hide(root.showingList, true)
    }

    function showNodeInfo(node){//显示节点详情
        nodeInfoBoard.hidden=!(node&&node.children);
        if(node&&node.children){
            createNodeInfo(node);
        }
    }
    function createNodeInfo(node){//创建节点详情
        nodeInfoInit(node);
        componentInfoInit(node);
    }
    function ignoreErr(){
        document.getElementById("error").style.opacity = 0;
    }
    ignoreErr();
    function nodeInfoInit(node){//初始化节点的数据
        let activeBlock = document.getElementById("nodeInfo_active");
        setActiveDiv(activeBlock, node.active);
        activeBlock.onclick = (e)=>{
            node.active = !node.active;
            setActiveDiv(activeBlock, node.active);
            createNodeList();
            ignoreErr();
        }
        let nameLabel = document.getElementById("nodeInfo_name");
        nameLabel.innerHTML = node.name;
        let printBtn = document.getElementById("nodeInfo_printBtn");
        printBtn.onclick = (e)=>{//打印节点
            console.log(node);
            console.log(`cc.find("`+getNodeUrl(node)+`")`);
        }
        let showBtn = document.getElementById("nodeInfo_showBtn");
        showBtn.onclick = (e)=>{//凸显节点
            let scale = node.scale;
            cc.tween(node)
                .to(0.2, {scale: scale*1.2})
                .to(0.2, {scale:scale})
                .start()
        }
        let urlLabel = nodeInfoBoard.getElementsByClassName("nodeInfo_url")[0];
        urlLabel.value = getNodeUrl(node);

        let nodePropertyList = [
            {title:"x", get value(){return node.getPosition().x}, set value(x){node.setPosition(cc.v3(x, node.getPosition().y))}},
            {title:"y", get value(){return node.getPosition().y}, set value(y){node.setPosition(cc.v3(node.getPosition().x, y))}},
            {title:"z", get value(){return node.zIndex}, set value(x){node.zIndex=parseFloat(x)}},
            {title:"width", get value(){try{return node.width}catch(e){}}, set value(x){try{node.width=parseFloat(x)}catch(e){}}},
            {title:"height", get value(){try{return node.height}catch(e){}}, set value(x){try{node.height=parseFloat(x)}catch(e){}}},
            {title:"scaleX", get value(){return node.scaleX}, set value(x){node.scaleX=parseFloat(x)}},
            {title:"scaleY", get value(){return node.scaleY}, set value(x){node.scaleY=parseFloat(x)}},
            {title:"angle", get value(){return node.angle}, set value(x){node.angle=parseFloat(x)}},
            {title:"anchorX", get value(){try{return node.anchorX}catch(e){}}, set value(x){try{node.anchorX=parseFloat(x)}catch(e){}}},
            {title:"anchorY", get value(){try{return node.anchorY}catch(e){}}, set value(x){try{node.anchorY=parseFloat(x)}catch(e){}}},
            {title:"opacity", get value(){try{return node.opacity}catch(e){}}, set value(x){try{node.opacity=parseFloat(x)}catch(e){}}},
            {title:"group", get value(){return node.group}, set value(x){node.group=(x)}},
        ];
        nodeInfoList.innerHTML="";
        let titleTxt = `<div style="width: 100;height: 25;border: 1px solid gray;margin-left:5;margin-top:1;display: inline-block;float: left;">x</div>`;
        let valueTxt = `<textarea spellcheck="false" class="nodeInfo_txt" style="resize:none;display: inline-block;width: calc(100% - 115px);border: 1px solid gray;height: 25;margin-left: 5;margin-top:1;text-align: center;">0</textarea>`;
        nodePropertyList.forEach((info, i)=>{
            let title = strToHTML(titleTxt);
            title.innerHTML = info.title;
            nodeInfoList.append(title);

            let value = strToHTML(valueTxt);
            value.value = info.value;
            nodeInfoList.append(value);
            value.oninput = (e)=>{
                info.value = value.value;
            }
        })
        nodeInfoList.append(strToHTML(`<div style="height:1;margin:2"></div>`));
    }
    function checkSameNodeInfo(){
        if(!currentNode || !currentNode.node || !currentNode.node.children){return false}
        let node = currentNode.node

        let nodePropertyList = [
            {title:"x", get value(){return node.x}, set value(x){node.x=parseFloat(x)}},
            {title:"y", get value(){return node.y}, set value(x){node.y=parseFloat(x)}},
            {title:"z", get value(){return node.zIndex}, set value(x){node.zIndex=parseFloat(x)}},
            {title:"width", get value(){return node.width}, set value(x){node.width=parseFloat(x)}},
            {title:"height", get value(){return node.height}, set value(x){node.height=parseFloat(x)}},
            {title:"scaleX", get value(){return node.scaleX}, set value(x){node.scaleX=parseFloat(x)}},
            {title:"scaleY", get value(){return node.scaleY}, set value(x){node.scaleY=parseFloat(x)}},
            {title:"angle", get value(){return node.angle}, set value(x){node.angle=parseFloat(x)}},
            {title:"anchorX", get value(){return node.anchorX}, set value(x){node.anchorX=parseFloat(x)}},
            {title:"anchorY", get value(){return node.anchorY}, set value(x){node.anchorY=parseFloat(x)}},
            {title:"opacity", get value(){return node.opacity}, set value(x){node.opacity=parseFloat(x)}},
            {title:"group", get value(){return node.group}, set value(x){node.group=(x)}},
        ];
        let infoValueArr = nodeInfoList.getElementsByClassName("nodeInfo_txt");
        for(let i = 0; i < infoValueArr.length; i += 1){
            if(infoValueArr[i].value!=nodePropertyList[i].value){
                return false;
            }
        }
        return true;
    }
    function setActiveDiv(div, active){//设置激活状态
        div.style.backgroundColor = active?"gray":"";
        div.style.color = active?"white":"transparent";
    }
    function strToHTML(str) {//字符串转HTML
        return new DOMParser().parseFromString(str, "text/html").body.firstChild;
    }
    function getNodeUrl(node){//获取节点的路径
        let n = node;
        let str = node.name;
        while(n){
            if(!n.parent){break}
            n = n.parent;
            if(!n.parent){break}
            str = n.name+"/"+str;
        }
        return str
    }
    function componentInfoInit(node){//节点的组件详情的初始化
        let componentArr = node._components;
        let componentTxt = `
                    <div class="nodeInfo_component" style="width:calc(100% - 10px);background-color: #ffffff33;border-radius: 5px;margin: 5;">
                        <div class="nodeInfo_component_enabled" style="cursor: pointer;display: inline-block;border: 2px solid white;width: 25;height: 25;text-align: center;background-color: gray;margin: 4;">√</div>
                        <a class="nodeInfo_component_name">cc.Sprite</a>
                        <div class="nodeInfo_printBtn" title="打印" style="
                            display: inline-block;float: right;background-color: gray;cursor: pointer;
                            width: 25;height: 25;text-align: center;border-radius: 5px;margin: 4;
                        ">☛</div>
                    </div>`;
        componentList.innerHTML = "";
        componentArr.forEach((component, i)=>{
            let newComponent = strToHTML(componentTxt);
            let activeBlock = newComponent.getElementsByClassName("nodeInfo_component_enabled")[0];
            setActiveDiv(activeBlock, component.enabled);
            activeBlock.onclick = (e)=>{
                component.enabled = !component.enabled;
                setActiveDiv(activeBlock, component.enabled);
            }
            let nameLabel = newComponent.getElementsByClassName("nodeInfo_component_name")[0];
            nameLabel.innerHTML = component.constructor.name;
            let printBtn = newComponent.getElementsByClassName("nodeInfo_printBtn")[0];
            printBtn.onclick = (e)=>{
                console.log(component);
                console.log(`cc.find("`+getNodeUrl(node)+`")._components[`+i+`]`);
            }
            componentList.append(newComponent);

        })
    }





})();