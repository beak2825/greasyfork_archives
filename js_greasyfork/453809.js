// ==UserScript==
// @name         search reviewer by automation
// @namespace    http://www.hechao.fun/
// @version      0.7
// @description  自动寻找有效的reviewer
// @author       Zero
// @match        *://susy.mdpi.com/user/assigned/process_form/*
// @license             End-User License Agreement
// @grant       GM_setClipboard
// @connect      *://*.mdpi.com/*
// @downloadURL https://update.greasyfork.org/scripts/453809/search%20reviewer%20by%20automation.user.js
// @updateURL https://update.greasyfork.org/scripts/453809/search%20reviewer%20by%20automation.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 复制
    function zeroCopy(text){
        GM_setClipboard(text);
        console.log(text, '复制成功！');

    }

    // 过滤issure
    function filterIssueData(text){
        const pathname = window.location.pathname.split('/');
        const key = pathname[pathname.length-1];
        const keywords = text || $('#special-issue-reviewers-search-input').val();
        if(!keywords) return;
        const arr = keywords.split('、');
        let num = 0;
        let names = [];
        $("#zeroList").html("<li>搜索中...</li>")
        arr.forEach(item=>{
            $.get("https://susy.mdpi.com/user/search_reviewers/from_special_issue/"+ key +"?keywords="+ item+"&show_not_be_invited=true",function(data,status){
                num++;
                if(status === 'success' && data.indexOf('No results.') === -1){
                    names.push(item);
                }
                if(num === arr.length){
                    $('#special-issue-reviewers-search-input').val('')
                    showNames(names,1);
                    sessionStorage.setItem('zeroName', JSON.stringify(names));
                    sessionStorage.removeItem('zeroEmail');
                    sessionStorage.removeItem('zeroRed');
                    zeroCopy('');
                }
            })
        })

    }

    // 过滤email
    function filterEmailData(text){
        const pathname = window.location.pathname.split('/');
        const key = pathname[pathname.length-1];
        const keywords = text || $('#form_email').val();
        if(!keywords) return;
        const arr = keywords.split('、');
        let num = 0;
        let names = [];
        $("#zeroList").html("<li>搜索中...</li>")
        arr.forEach(item=>{
            $.get("https://susy.mdpi.com/user/reviewer/checking/"+ key +"?email="+ item,function(data,status){
                num++;
                if(status === 'success' && data.indexOf('value="Proceed"') > -1){
                    names.push(item);
                }
                if(num === arr.length){
                    $('#form_email').val('')
                    showNames(names,2);
                    sessionStorage.setItem('zeroEmail', JSON.stringify(names));
                    sessionStorage.removeItem('zeroName');
                    sessionStorage.removeItem('zeroRed');
                    zeroCopy('');
                }
            })
        })

    }

    // 点击过滤email
    function handleClickEmail(e){
        navigator.clipboard
            .readText()
            .then((v) => {
            if(e.data){
                filterIssueData(v)
            } else{
                filterEmailData(v);
            }
        }).catch((v) => {
            console.log("获取剪贴板失败: ", v);
            if(e.data){
                filterIssueData(v)
            } else{
                filterEmailData(v);
            }
        });
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


    // 把符合要求的issure name显示出来
    function showNames(names,type,list=[]){
        let result = '';
        names.forEach(item=>{
            const redColor = list.includes(item) ? 'color:#fb0505' :'';
            result += '<li style="margin-bottom: 10px;cursor: pointer;'+ redColor + '">'+ item  + '</li>'
        })
        $("#zeroList").html(result);
        $('#zeroList').on('click', 'li',function(e){
            const name = e.currentTarget.innerText;
            if(type=== 1){
                $('#special-issue-reviewers-search-input').val(name);
                document.getElementById('special-issue-reviewers-search-btn').click();
            }else{
                if(document.getElementById('specialBackBtn')) document.getElementById('specialBackBtn').click();
                $('#form_email').val(name);
                document.getElementById('nextBtn').click();
            }
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
padding:0;
margin: 0;
max-height: 400px;
overflow-y: auto;
font-size: 14px;
line-height: 16px;
word-wrap: break-word;
word-break: break-all;
">

</ul>

<button
id="zeroSearchIssure"
style="
font-size: 14px;
padding: 6px 12px;
background-color: #21c6e4;
border: none;
border-radius: 5px;
cursor: pointer;
"
>Filter Issue</button
>

<button
id="zeroSearchEmail"
style="
font-size: 14px;
padding: 6px 12px;
background-color: #21c6e4;
border: none;
border-radius: 5px;
cursor: pointer;
margin-left: 10px;
"
>Filter Email</button
>

</div>
`;

    $('body').append(searchContent);

    $('#zeroSearchIssure').on('click', 1, handleClickEmail);
    $('#zeroSearchEmail').on('click', 0, handleClickEmail);
    const oldData1 = JSON.parse(sessionStorage.getItem('zeroName'));
    const oldData2 = JSON.parse(sessionStorage.getItem('zeroEmail'));
    let oldData3 = JSON.parse(sessionStorage.getItem('zeroRed')) || [];
    if(!!oldData1){
        showNames(oldData1,1,oldData3);
    }
    if(!!oldData2){
        showNames(oldData2,2,oldData3);
    }


})();