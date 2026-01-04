// ==UserScript==
// @name         search guest editor invitation by automation
// @namespace    http://www.hechao.fun/
// @version      0.1
// @description  自动寻找有效的特邀编辑
// @author       Zero
// @match        *://susy.mdpi.com/special_issue/process/*
// @license             End-User License Agreement
// @grant       GM_setClipboard
// @connect      *://*.mdpi.com/*
// @downloadURL https://update.greasyfork.org/scripts/536700/search%20guest%20editor%20invitation%20by%20automation.user.js
// @updateURL https://update.greasyfork.org/scripts/536700/search%20guest%20editor%20invitation%20by%20automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制
    function zeroCopy(text){
        GM_setClipboard(text);
        console.log(text, '复制成功！');

    }

    // 过滤email
    function filterEmailData(arr){
        const pathname = window.location.pathname.split('/');
        const key = pathname[pathname.length-1];
        if(arr.length === 0) return;
        let num = 0;
        let names = [];
        $("#zeroList").html("<li>搜索中...</li>")
        arr.forEach(item=>{
            $.get("https://susy.mdpi.com/user/guest_editor/check?email="+ item + "&special_issue_id="+key,function(data,status){
                num++;
                if(status === 'success' && data.indexOf('value="Proceed"') > -1){
                    names.push(item);
                }
                if(num === arr.length){
                    $('#form_email').val('')
                    $('#emials').val('');
                    showNames(names);
                    sessionStorage.setItem('zeroEditor', JSON.stringify(names));
                    sessionStorage.removeItem('zeroRed');
                    zeroCopy('');
                }
            })
        })

    }

    // 从剪贴板中复制email
    function handleClickEditor(e){
        const str = $('#emials').val();
        if(str){
        const emials = str.split('\n').filter(item=> !!item);
            console.log(emials);
            filterEmailData(emials);
            return;
        }else{
           alert("请先粘贴到文本框");
        }
    }

    // 储存红色的
    function setRed(key){
        let oldData = JSON.parse(sessionStorage.getItem('zeroRed'));
        if(oldData){
            sessionStorage.setItem('zeroRed', JSON.stringify(oldData.concat([key])));
        }else{
            sessionStorage.setItem('zeroRed', JSON.stringify([key]));
        }
    }


    // 把符合要求的Editor显示出来
    function showNames(names,list=[]){
        let result = '';
        names.forEach(item=>{
            const redColor = list.includes(item) ? 'color:#fb0505' :'';
            result += '<li style="margin-bottom: 10px;cursor: pointer;'+ redColor + '">'+ item  + '</li>'
        })
        $("#zeroList").html(result);
        $('#zeroList').on('click', 'li',function(e){
            const name = e.currentTarget.innerText;
            if(document.getElementById('specialBackBtn')) document.getElementById('specialBackBtn').click();
            $('#form_email').val(name);
            document.getElementById('guestNextBtn').click();
            $(this).css({
                color: '#fb0505'
            })
            setRed(name);
        });
    }


    let searchContent = `
<div
style="
position: fixed;
bottom: 2px;
left: 2px;
z-index: 9999999999999999;
border: 1px solid #eeeeee;
background-color: #ffffff;
width: 260px;
min-height: 200px;
"
>
<ul
id="zeroList"
style="
margin-bottom: 10px;
list-style-type: none;
padding:5px;
margin: 0;
max-height: 400px;
overflow-y: auto;
font-size: 14px;
line-height: 16px;
word-wrap: break-word;
word-break: break-all;
">

</ul>
<textarea id="emials" placeholder="从excel中粘贴emial到这里" style="width: 100%;" />
<button
id="zeroSearchEditor"
style="
font-size: 14px;
padding: 6px 12px;
background-color: #21c6e4;
border: none;
border-radius: 5px;
cursor: pointer;
margin-left: 10px;
"
>Filter Editor</button
>

</div>
`;

    $('body').append(searchContent);

    $('#zeroSearchEditor').on('click', handleClickEditor);
    const oldData1 = JSON.parse(sessionStorage.getItem('zeroEditor'));
    let oldData2 = JSON.parse(sessionStorage.getItem('zeroRed')) || [];
    if(!!oldData1){
        showNames(oldData1,oldData2);
    }


})();