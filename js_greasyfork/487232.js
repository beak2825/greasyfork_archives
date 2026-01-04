// ==UserScript==
// @name         bilibili 收藏夹批量复制
// @namespace    http://tampermonkey.net/
// @version      2024-02-15 v0.5
// @description  批量复制bilibili收藏夹!
// @author       You
// @match        https://space.bilibili.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487232/bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/487232/bilibili%20%E6%94%B6%E8%97%8F%E5%A4%B9%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';


class EventListeners {

    static toggleSelectAll() {
        if (this.selectAllButton.textContent === "点我全选") {
            for (const chkbocItem of this.favCheckboxItemList) {
                chkbocItem.checkbox.checked = true;
            }
            this.selectAllButton.textContent = "点我全部取消";
        } else {
            for (const chkbocItem of this.favCheckboxItemList) {
                chkbocItem.checkbox.checked = false;
            }
            this.selectAllButton.textContent = "点我全选";
        }
    }
    static toggleSelectAll(selectAllButton, favCheckboxItemList) {
        if (selectAllButton.textContent === "点我全选") {
            for (const chkbocItem of favCheckboxItemList) {
                chkbocItem.checkbox.checked = true;
            }
            selectAllButton.textContent = "点我全部取消";
        } else {
            for (const chkbocItem of favCheckboxItemList) {
                chkbocItem.checkbox.checked = false;
            }
            selectAllButton.textContent = "点我全选";
        }
    }

    static toggleMinimize() {
        const floP = this.floatingPanel;
        if (this.minimizeButton.textContent === "点我最小化") {

            this.recordHiddenPanelSize(); 
            this.minimizeButton.textContent = "点我打开面板";
            floP.style.width = this.minW + "px";
            floP.style.height = this.minH + "px";

        } else {
            this.minimizeButton.textContent = "点我最小化";

            floP.style.width = Math.max(this.hiddenWidth, floP.offsetWidth, this.originFPW) + "px";
            floP.style.height = Math.max(this.hiddenHeight, floP.offsetHeight, this.originFPH) + "px";

        }
    }


    static stopResizeOnBody() {
        this.resizeable = false
    }
    static stopDragOnPanel() {
        this.isDragging = false;
    }



    static mouseDown(e) {
        const floP = this.floatingPanel;
        let d = this.getDirection(e)

        if (d !== '') {
            this.resizeable = true
            this.isDragging = false
            this.direction = d

        } else {
            
            

            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.classList.contains('output-text-box')) {
                
            }
            else {
                this.isDragging = true;
                this.offsetX = e.clientX - floP.getBoundingClientRect().left;
                this.offsetY = e.clientY - floP.getBoundingClientRect().top;
            }
        }
    }

    
    static mouseMove(e) {
        let floP = this.floatingPanel;
        
        let d = this.getDirection(e)

        
        let cursor
        if (d === '') cursor = 'default';
        else cursor = d + '-resize';
        floP.style.cursor = cursor;

        if (this.resizeable) {
            
            const direc = this.direction;
            let newWidth = floP.offsetWidth;
            let newHeight = floP.offsetHeight;
            

            let originTop = floP.offsetTop;
            let originLeft = floP.offsetLeft;
            let newTop = originTop;
            let newLeft = originLeft;

            
            
            if (direc.indexOf('w') !== -1) {
                newWidth -= e.movementX;
                newLeft += e.movementX;
            }
            
            if (direc.indexOf('n') !== -1) {
                newHeight -= e.movementY;
                newTop += e.movementY;
            }

            
            if (direc.indexOf('e') !== -1) {
                newWidth += e.movementX;

            }

            
            if (direc.indexOf('s') !== -1) {
                newHeight += e.movementY;
            }


            this.judgePanelSizeAndUpdate(newLeft, newTop, newWidth, newHeight, originTop, originLeft);



        }
    }


    static dragOnPanel(e) {
        if (this.isDragging) {
            const floP = this.floatingPanel;
            
            let newLeft = e.clientX - this.offsetX;
            let newTop = e.clientY - this.offsetY;

            this.judgePanelPosAndUpdate(newLeft, newTop);
        }
    }




}


class CreateElemClass {
    constructor() {
        this.name = "CreateElemClass";
    }
    getName() {
        return this.name;
    }
    static createButton(text, clickHandler, className = "btn") {
        const button = document.createElement("button");
        button.textContent = text;

        button.classList.add("btn");
        
        button.style.margin = "0px";
        button.style.padding = '0px 0px';
        button.style.fontSize = '14px';
        
        button.style.width = '150px';
        button.style.height = '40px';

        
        button.style.marginTop = '5px';
        button.style.marginLeft = '5px';

        if (clickHandler)
            button.addEventListener("click", clickHandler);

        return button;
    }

    static createOutputTextBox() {

        
        const editableArea = document.createElement('div');

        
        editableArea.classList.add('output-text-box');
        
        
        editableArea.style.border = '1px solid #ccc'; 
        editableArea.style.padding = '5px'; 
        editableArea.style.boxSizing = 'border-box'; 
        editableArea.style.whiteSpace = 'nowrap'; 
        editableArea.style.minWidth = "400px";
        editableArea.contentEditable = true; 
        editableArea.style.flexGrow = "1";
        
        

        editableArea.style.overflow = 'auto'; 
        
        
        
        
        

        
        editableArea.addEventListener('scroll', function () {
            this.scrollTopEnabled = false;
        });
        return editableArea;
    }



    static createSubDiv(className, floatPos, width, height) {
        const subPanel = document.createElement("div");
        subPanel.style.flexGrow = "1";
        subPanel.style.display = 'flex';
        subPanel.style.border = "1px solid #ccc"; 
        if (className)
            subPanel.classList.add(className);
        if (floatPos)
            subPanel.style.float = floatPos;
        if (width)
            subPanel.style.width = width;

        if (height) {
            subPanel.style.height = height;
        }


        return subPanel;
    }
}
class CheckboxItem {
    constructor(favName) {
        this.checkboxContainer = this.createCheckboxContainer(favName);
        this.checkbox = this.checkboxContainer.querySelector("input[type='checkbox']");
        this.label = this.checkboxContainer.querySelector("label");
        this.inputText = this.checkboxContainer.querySelector("input[type='text']");
    }

    createCheckboxContainer(favName) {
        const checkboxContainer = document.createElement("div");
        const checkboxDiv = CreateElemClass.createSubDiv("signal-panel");
        checkboxDiv.style.justifyContent = "space-between";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = `checkbox-${favName}`;

        
        const label = document.createElement("label");
        label.textContent = favName;
        label.setAttribute("for", `checkbox-${favName}`);

        
        const inputText = document.createElement("input");
        inputText.type = "text";
        inputText.value = favName;
        
        inputText.style.textAlign = "center";

        
        checkboxDiv.appendChild(checkbox);
        checkboxDiv.appendChild(label);
        checkboxDiv.appendChild(inputText);

        
        checkboxContainer.appendChild(checkboxDiv);

        return checkboxContainer;
    }

    getLabelValue() {
        return this.label.textContent;
    }

    getInputTextValue() {
        return this.inputText.value;
    }

    getCheckboxValue() {
        return this.checkbox.checked;
    }
}


class ControlPanel {
    constructor(favBtns, favulList) {
        this.createMembers(favBtns, favulList);
        this.leftPanel = this.createLeftPanel();
        this.rightPanel = this.createRightPanel();
        this.floatingPanel = this.createFloatingPanel();


    }

    createMembers(favBtns, favulList) {
        this.delayTimeShort = 500;
        this.delayTimeMiddle = 1000;
        
        this.errorCode = 0;
        this.normalCode = 1;
        this.startBatchCode = 2;
        this.startSingleCode = 3;
        this.endSingleCode = 4;
        this.endBatchCode = 5;
        this.onePageCode = 6;

        this.leftWidth = "35%";
        this.rightWidth = "63%";


        this.isDragging = false;
        this.resizeable = false; 
        this.scrollTopEnabled = true;

        this.favBtns = favBtns;
        this.favulList = favulList;
        this.favCheckboxItemList = this.createFavCheckboxItems();
    }

    createLeftPanel() {
        this.btnContainer = this.cretaeButtonContainer();
        
        this.favContainer = this.createFavPanel();
        
        
        const leftPanel = CreateElemClass.createSubDiv("left-panel", "left");
        leftPanel.appendChild(this.btnContainer);
        leftPanel.appendChild(this.favContainer);
        leftPanel.style.flexGrow = "0"; 

        
        

        
        leftPanel.style.backgroundColor = "green";

        return leftPanel;
    }

    createRightPanel() {

        const textContainer = document.createElement("div");
        const textDiv = CreateElemClass.createSubDiv("div");
        

        const hintText = document.createElement("h3");
        
        hintText.style.fontWeight = "bold";
        hintText.textContent = "输出信息";

        textDiv.appendChild(hintText);
        textContainer.appendChild(textDiv);


        this.outputTextBox = CreateElemClass.createOutputTextBox();
        this.outputTextBox.style.backgroundColor = "pink";

        const rightPanel = CreateElemClass.createSubDiv("right-panel", "right");
        rightPanel.style.backgroundColor = "yellow";
        rightPanel.style.overflowX = "hidden";
        
        rightPanel.style.flexDirection = 'column';
        rightPanel.appendChild(textContainer);
        rightPanel.appendChild(this.outputTextBox);

        
        



        
        

        
        return rightPanel;
    }

    cretaeButtonContainer() {
        const btnContainer = document.createElement("div");
        this.btnPanel = this.createButtonPanel();
        btnContainer.appendChild(this.btnPanel);
        return btnContainer;
    }

    createButtonPanel() {
        const btnPanel = document.createElement("div");
        btnPanel.className = "btn-panel";
        
        btnPanel.style.display = 'flex';
        btnPanel.style.border = "1px solid #ccc"; 

        
        btnPanel.style.backgroundColor = "purple";
        btnPanel.style.flexDirection = 'column';

        const selectAllButton = CreateElemClass.createButton("点我全选");
        selectAllButton.addEventListener("click", () => {
            EventListeners.toggleSelectAll(selectAllButton, this.favCheckboxItemList);
        });
        

        const startBatchTransferButton = CreateElemClass.createButton("开始批量复制");
        const startTransferCurrentButton = CreateElemClass.createButton("开始复制当前收藏夹");
        const minimizeButton = CreateElemClass.createButton("点我最小化", EventListeners.toggleMinimize.bind(this), "minimize-btn");
        const destroyButton = CreateElemClass.createButton('点我销毁', () => {
            this.floatingPanel.remove();
            
            delete this;



        });

        btnPanel.appendChild(selectAllButton);
        btnPanel.appendChild(startBatchTransferButton);
        let showAll = false;
        if (showAll) {
            btnPanel.appendChild(startTransferCurrentButton); 
        }
        btnPanel.appendChild(minimizeButton);
        btnPanel.appendChild(destroyButton);

        this.selectAllButton = selectAllButton;
        this.minimizeButton = minimizeButton;
        this.startBatchTransferButton = startBatchTransferButton;
        this.startTransferCurrentButton = startTransferCurrentButton;

        

        return btnPanel;
    }

    createFavContainer() {
        const favContainer = document.createElement("div");
        this.favPanel = this.createFavPanel();
        favContainer.appendChild(this.favPanel);
        return favContainer;
    }

    createFavPanel() {
        const favPanel = CreateElemClass.createSubDiv("fav-panel");
        
        favPanel.style.backgroundColor = "red";
        
        
        favPanel.style.overflow = "auto";
        favPanel.style.flexDirection = 'column';

        
        const textContainer = document.createElement("div");

        const textDiv = CreateElemClass.createSubDiv("div");
        
        textDiv.style.justifyContent = "space-between";

        const srcText = document.createElement("h3");
        
        srcText.style.fontWeight = "bold";
        srcText.textContent = "源收藏夹";

        const dstText = document.createElement("h3");
        
        dstText.style.fontWeight = "bold";
        dstText.textContent = "目标收藏夹";

        
        textDiv.appendChild(srcText);
        textDiv.appendChild(dstText);

        
        textContainer.appendChild(textDiv);
        favPanel.appendChild(textContainer);

        for (const chkboxItem of this.favCheckboxItemList) {
            favPanel.appendChild(chkboxItem.checkboxContainer);
        }
        return favPanel;
    }

    createFavCheckboxItems() {
        let favCheckboxItemList = [];
        for (const ul of this.favulList) {
            const chkboxItem = new CheckboxItem(ul.textContent);
            favCheckboxItemList.push(chkboxItem);
        }
        return favCheckboxItemList;
    }

    getSelectedItems() {
        let selectedItems = [];
        for (const chkboxItem of this.favCheckboxItemList) {
            if (chkboxItem.getCheckboxValue()) {
                selectedItems.push(chkboxItem);
            }
        }
        return selectedItems;
    }

    recordPanelSize() {

        const fPW = this.floatingPanel.offsetWidth;
        const fPH = this.floatingPanel.offsetHeight;

        if (this.originRPW === undefined) {

            this.originRPW = this.rightPanel.offsetWidth;
            this.originRPH = this.rightPanel.offsetHeight;

            this.originBtnContainerW = this.btnContainer.offsetWidth;
            this.originBtnContainerH = this.btnContainer.offsetHeight;

            this.originFavContainerW = this.favContainer.offsetWidth;
            this.originFavContainerH = this.favContainer.offsetHeight;

            this.originFPW = fPW;
            this.originFPH = fPH;

            this.minW = this.originFPW;
            this.minW = this.leftPanel.offsetWidth;
            this.minH = this.originFPH;
            this.minH = this.btnPanel.offsetHeight;
            
            
        }


        
        

        
        this.floatingPanel.style.width = fPW + "px";
        this.floatingPanel.style.height = fPH + "px";

    }

    recordHiddenPanelSize() {
        this.hiddenWidth = this.floatingPanel.offsetWidth;
        this.hiddenHeight = this.floatingPanel.offsetHeight;
    }




    judgePanelSizeAndUpdate(newLeft, newTop, newWidth, newHeight, originTop, originLeft) {

        const floP = this.floatingPanel;
        


        


        
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;

        if (newLeft < 0 || newLeft + newWidth > viewportWidth) {
            return
        }
        if (newTop < 0 || newTop + newHeight > viewportHeight) {
            return
        }


        
        if (newWidth < this.minW) {
            newWidth = this.minW;
            newLeft = originLeft;
        }

        

        if (newHeight < this.minH) {
            newHeight = this.minH;
            newTop = originTop;
        }
        
        
        

        
        
        



        floP.style.width = newWidth + "px";
        floP.style.height = newHeight + "px";

        floP.style.top = newTop + "px";
        floP.style.left = newLeft + "px";


    }
    judgePanelPosAndUpdate(newLeft, newTop) {

        const floP = this.floatingPanel;
        
        let viewportWidth = window.innerWidth || document.documentElement.clientWidth;
        let viewportHeight = window.innerHeight || document.documentElement.clientHeight;


        
        newLeft = Math.max(0, Math.min(newLeft, viewportWidth - floP.offsetWidth));
        newTop = Math.max(0, Math.min(newTop, viewportHeight - floP.offsetHeight));


        
        floP.style.left = newLeft + "px";
        floP.style.top = newTop + "px";

        
    }

    createFloatingPanel() {
        
        const floP = document.createElement("div");
        
        floP.style.backgroundColor = "blue";
        floP.classList.add("floating-panel");
        floP.style.position = "fixed";
        floP.style.top = "50px";
        floP.style.left = "50px";
        floP.style.backgroundColor = "#ffffff";
        floP.style.border = "0px solid #ccc";
        floP.style.borderRadius = "5px";
        floP.style.padding = "0px";
        floP.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        floP.style.zIndex = "99999";

        
        

        floP.style.display = "flex";



        floP.addEventListener('mousedown', EventListeners.mouseDown.bind(this));
        floP.addEventListener("mouseup", EventListeners.stopDragOnPanel.bind(this));
        floP.addEventListener("mousemove", EventListeners.dragOnPanel.bind(this));

        
        document.body.addEventListener('mousemove', EventListeners.mouseMove.bind(this))
        document.body.addEventListener('mouseup', EventListeners.stopResizeOnBody.bind(this));



        floP.appendChild(this.leftPanel);
        floP.appendChild(this.rightPanel);
        return floP;
    }

    
    getDirection(ev) {
        const floP = this.floatingPanel;
        let dir = '';
        if (ev.clientX - floP.getBoundingClientRect().left < 15)
            dir += 'w';
        else if (floP.getBoundingClientRect().right - ev.clientX < 15)
            dir += 'e';

        if (ev.clientY - floP.getBoundingClientRect().top < 15)
            dir += 'n';
        else if (floP.getBoundingClientRect().bottom - ev.clientY < 15)
            dir += 's';
        return dir;

    }

    appendInfo(info, type = this.normalCode) {
        this.appendInfoToTextarea(this.outputTextBox, info, type);
    }

    appendInfoToTextarea(textarea, info, type = this.normalCode) {
        
        
        let currentDate = new Date();
        let timezoneOffset = currentDate.getTimezoneOffset();
        let timezoneOffsetMilliseconds = timezoneOffset * 60 * 1000;
        let userCurrentDate = new Date(currentDate.getTime() - timezoneOffsetMilliseconds);
        let formattedDate = userCurrentDate.toISOString().replace(/T/, ' ').replace(/\..+/, '');
        
        let textColor;
        let brCnt = 1;
        switch (type) {
            case this.errorCode:
                textColor = 'red';
                break;
            case this.normalCode:
                textColor = 'black';
                break;
            case this.endBatchCode:
                brCnt++;
            case this.startBatchCode:
                brCnt++;
                textColor = 'blue';
                break;
            case this.endSingleCode:
                brCnt++;
            case this.startSingleCode:
                textColor = 'green';
                break;
            case this.onePageCode:
                textColor = 'purple';
                info+="--------------";
                break;
            default:
                textColor = 'black'; 
                break;
        }

        
        const span = document.createElement('span');
        span.style.color = textColor;
        span.textContent = formattedDate + ':' + info; 

        
        textarea.appendChild(span);
        for (let i = 0; i < brCnt; i++) {
            textarea.appendChild(document.createElement('br'));
        }


        
        if (this.scrollTopEnabled) {
            textarea.scrollTop = textarea.scrollHeight;
        }
    }



}
class BatchTransfer {

    constructor() {
        this.usage = "Hi，这是一个Bilibili 收藏夹管理工具，可以批量复制保存其他人的收藏夹视频，也可以批量复制自己的收藏夹视频（还未实现）。";
        this.delayTimeShort = 500;
        this.delayTimeMiddle = 1000;
        
        this.errorCode = 0;
        this.normalCode = 1;
        this.startBatchCode = 2;
        this.startSingleCode = 3;
        this.endSingleCode = 4;
        this.endBatchCode = 5;
        this.onePageCode = 6;

        
        this.favBtns = this.getAllFavBtns(); 
        this.favulList = this.iterateFavs(); 

        this.selectedItems = []
        
        this.ctl = new ControlPanel(this.favBtns, this.favulList);
        this.floatingPanel = this.ctl.floatingPanel;

        this.ctl.startBatchTransferButton.addEventListener("click", this.initiateBatchOperation.bind(this));
        this.ctl.startTransferCurrentButton.addEventListener("click", this.transferOneFav.bind(this));


        document.body.insertBefore(this.floatingPanel, document.body.firstChild);
        this.ctl.recordPanelSize();
    }



    getAllFavLinks() {
        
        let parentElement = document.getElementById('fav-createdList-container');
        
        let links = parentElement.querySelectorAll('a[href]');
        return links;
    }

    getAllFavBtns() {
        let buttons = document.querySelectorAll('#fav-createdList-container .fav-item a');
        return buttons;
        
        buttons.forEach(function (button) {
            button.click(); 
        });
    }
    iterateFavs() {
        
        let favulList = []
        for (const btn of this.favBtns) {
            const ul = document.createElement("ul");
            ul.innerHTML = "<input type='checkbox' id='checkBox' name='checkBox' value='" + btn.title + "' />" + btn.title;
            favulList.push(ul);
        }
        return favulList;
    }


    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async initiateBatchOperation() {
        
        

        
        this.selectedItems = this.ctl.getSelectedItems();

        await this.delay(this.delayTimeShort);
        this.ctl.appendInfo("开始批量复制", this.startBatchCode);

        for (const item of this.selectedItems) {
            let srcFav = item.getLabelValue();
            let dstFav = item.getInputTextValue();

            
            let btn = null;
            this.favBtns.forEach(function (button) {
                if (button.title === srcFav) {
                    btn = button;
                    return;
                }
            });
            btn.click();
            await this.delay(this.delayTimeShort);
            await this.transferOneFav(srcFav, dstFav);
        }

        this.ctl.appendInfo("批量复制结束", this.endBatchCode);

    }

    async transferOneFav(sourceFavName, targetFavName) {

        if (sourceFavName === undefined) {
            const sourceFavName = document.querySelector('.favInfo-details .fav-name').textContent.trim();
        }
        if (targetFavName === undefined) {
            const targetFavName = sourceFavName;
        }

        const totalPagesElement = document.querySelector('.be-pager-item[title^="最后一页"]');
        const totalPages = totalPagesElement ? parseInt(totalPagesElement.textContent.trim().split(':')[0]) : 1; 

        this.ctl.appendInfo("开始复制收藏夹[" + sourceFavName + "]到[" + targetFavName + "],一共" + totalPages + "页", this.startSingleCode);

        
        let batchOperationButton = document.querySelector('.filter-item.do-batch .text');
        if (batchOperationButton && batchOperationButton.textContent.trim() === "批量操作") {
            batchOperationButton.click();
        } else {
            this.ctl.appendInfo("Error!!! 找不到[批量操作]按钮或按钮文本不匹配", this.errorCode);

        }
        await this.delay(this.delayTimeShort);
        await this.saveCollection(1, totalPages, sourceFavName, targetFavName); 
    }

    async saveCollection(currentPage, totalPages, sourceFavName, targetFavName) {
        if (sourceFavName === undefined) {
            const sourceFavName = document.querySelector('.favInfo-details .fav-name').textContent.trim();
        }
        if (targetFavName === undefined) {
            const targetFavName = sourceFavName;
        }

        if (currentPage > totalPages || totalPages == 0) {
            this.ctl.appendInfo("收藏夹[" + sourceFavName + "]复制到[" + targetFavName + "]结束", this.endSingleCode);
            return;
        }

        this.ctl.appendInfo("正在保存第" + currentPage + "页", this.onePageCode);

        this.ctl.appendInfo("点击[全选]按钮");
        document.querySelector('.icon-selece-all').parentNode.click();
        await this.delay(this.delayTimeShort);

        this.ctl.appendInfo("点击[复制到]按钮");
        document.querySelector('.icon-copy').parentNode.click();
        await this.delay(this.delayTimeShort);

        const targetFavList = document.querySelectorAll('.target-favlist-container .fav-name');
        let hasSameNameFav = false;

        targetFavList.forEach(function (targetFav) {
            if (targetFav.textContent.trim() === targetFavName) {
                hasSameNameFav = true;
                return;
            }
        });

        if (!hasSameNameFav) {
            this.ctl.appendInfo("创建新的收藏夹：[" + targetFavName + "]");
            this.ctl.appendInfo("点击[新建收藏夹]按钮");
            document.querySelector('.fake-fav-input').click();
            await this.delay(this.delayTimeMiddle);

            this.ctl.appendInfo("输入新收藏夹名称：[" + targetFavName + "]");
            const inputText = document.querySelector('.add-fav-input');
            inputText.value = targetFavName;
            inputText.dispatchEvent(new Event('input', { bubbles: true }));
            await this.delay(this.delayTimeShort);

            this.ctl.appendInfo("点击[新建]按钮");
            document.querySelector('.fav-add-btn').click();
        }

        await this.delay(this.delayTimeShort);

        this.ctl.appendInfo("点击目标收藏夹：[" + targetFavName + "]");
        const favListContainer = document.querySelector('.target-favlist-container');
        const favItems = favListContainer.querySelectorAll('.target-favitem');

        favItems.forEach(function (item) {
            const folderNameElement = item.querySelector('.fav-name');
            if (folderNameElement && folderNameElement.textContent.trim() === targetFavName) {
                folderNameElement.click();
                return;
            }
        });

        await this.delay(this.delayTimeShort);

        this.ctl.appendInfo("点击[确定]");
        const panel = document.querySelector('.edit-video-modal');
        const confirmBtn = panel.querySelector('.btn-content');
        confirmBtn.click();
        await this.delay(this.delayTimeShort);

        this.ctl.appendInfo("点击[下一页]按钮");
        const nextPageBtn = document.querySelector('.be-pager-next');
        if(!nextPageBtn){
            this.ctl.appendInfo("Error!!! 找不到[下一页]按钮,判断为单页收藏夹.", this.errorCode);
            this.ctl.appendInfo("收藏夹[" + sourceFavName + "]复制到[" + targetFavName + "]结束", this.endSingleCode);
            return;
        }
        nextPageBtn.click();
        await this.delay(this.delayTimeMiddle);
        await this.saveCollection(currentPage + 1, totalPages, sourceFavName, targetFavName);
    }
}


setTimeout(function () {
    let bt = new BatchTransfer()
}, 2000);



    // Your code here...
})();