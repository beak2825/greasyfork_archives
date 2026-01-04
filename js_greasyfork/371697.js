// ==UserScript==
// @icon         http://www.iqing.com/iriya/img/人物.0a09b6d.png
// @name         IQA Maker Plus
// @namespace    http://www.iqing.com/
// @version      0.88888888888
// @description  给轻文的编辑器添加素材库隐藏 预览添加命令
// @author       Ts8zs
// @include      *//www.iqing.com/preview.html*
// @include      *//www.iqing.com/iriya.html*
// @update       https://greasyfork.org/scripts/371697-iqa-maker-plus/code/IQA%20Maker%20Plus.user.js
// @downloadURL https://update.greasyfork.org/scripts/371697/IQA%20Maker%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/371697/IQA%20Maker%20Plus.meta.js
// ==/UserScript==


/* <datalist id="iqacmd">
    <option>@jump</option>
    <option>@in</option>
    <option>@sel</option>
    <option>@clear</option>
    <option>@action</option>
    <option>@play</option>
    <option>@stop</option>
    <option>@add</option>
    <option>@break</option>
    <option>@random</option>
</datalist> */

//预览指令控制
if (/.*preview.*/.test(location.href)) {
    document.getElementsByClassName('nav')[0].innerHTML +=
        `<div style="position:fixed;z-index:100000;right:0;bottom:0;left:0;">
<input id="command" list="iqacmd" style="width:100%;font-size: 24px;" placeholder="输入指令回车执行"></div>
`;
    var cmdhistory = [];
    var cmdpointer = 0;
    command.onkeyup = function (e) {
        switch (e.key) {
            case 'Enter':
                previewIframe.contentWindow.game.logic.Stage_exec.insert(command.value);
                cmdhistory.push(command.value);
                cmdpointer = cmdhistory.length - 1;
                command.value = '';
                break;
            case 'ArrowUp':
                command.value = cmdhistory[cmdpointer]||'';
                cmdpointer--;
                if (cmdpointer < 0) cmdpointer = 0;
                break;
            case 'ArrowDown':
                cmdpointer++;
                if (cmdpointer >= cmdhistory.length) {
                    command.value = '';
                    cmdpointer = cmdhistory.length - 1;
                } else {
                    command.value = cmdhistory[cmdpointer];
                }
                break;
            default:
                break;
        }
    };
}


document.domain = "iqing.com";

function iriya() {
    //ctrl+s快捷键
    document.onkeydown=function (e){
        var currKey=0;
        e=e||event||window.event;
        currKey = e.keyCode||e.which||e.charCode;
        if(currKey == 83 && (e.ctrlKey||e.metaKey)){
            e.preventDefault();
            document.querySelector('#stage > div.default-top.navbar-top-high.higher-theme > button.el-button.el-button--warning.el-button--small').click();
        }else{
        }
    }

    //素材列表隐藏
    document.getElementsByClassName('editor-top')[0].innerHTML +=
        `<button id="fold" class="el-button  el-button--small" style="margin-left:10px;"  onclick="
if(document.getElementsByClassName('material-list-panel')[0].style.display=='block')
{ document.getElementsByClassName('material-list-panel')[0].style.display='none'; fold.innerText='<显示素材列表'}
else { document.getElementsByClassName('material-list-panel')[0].style.display='block';fold.innerText='隐藏素材列表>' }
">
隐藏素材列表>
</button>
`
    //素材列表过滤
    var ele = document.createElement('div')
    ele.innerHTML = `<div style="width: 100%;display: flex;">
<input type="text" style="width: 100%;height: 15px;" id="mtfilter" placeholder="素材过滤" onkeyup="
        document.querySelectorAll('.item').forEach(function (e) {
            if(e.querySelector('p').innerText.indexOf(mtfilter.value)==-1){
                e.style.display='none';
            }else{
                e.style.display = '';
            }
        })
    "></div>
`
    document.querySelector('.material-top').after(ele);

    //修正添加过滤框后的列表高度
    document.querySelector('.material-main').style.height = "calc(100% - 60px)";

    //素材名称快速复制
    document.querySelector('.material-list-wrap').onclick = function (e) {
        if (e.toElement.tagName == 'P') {
            const input = document.createElement('input');
            input.setAttribute('readonly', 'readonly');
            input.setAttribute('value', e.toElement.innerText);
            document.body.appendChild(input);
            input.select()
            if (document.execCommand('copy')) {
                console.log('复制成功：' + e.toElement.innerText);
            }
            document.body.removeChild(input);
        }
    }
}
if (/.*iriya.*/.test(location.href))
    setTimeout(iriya, 1000);
