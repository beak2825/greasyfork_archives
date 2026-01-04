// ==UserScript==
// @name         Public Document helper
// @namespace    https://youtu.be/5OI2hmEPYgc
// @version      0.035
// @description  try to take over the worldQQ https://greasyfork.org/zh-TW/scripts/470132-public-document-helper!
// @author       yuXs
// @match        https://*.miaoli.gov.tw/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470132/Public%20Document%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/470132/Public%20Document%20helper.meta.js
// ==/UserScript==


var wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// wait(2000).then(() => console.log())

// let init = true;
// $('body').click(async ({ target }) => {
//     if(init){
//         init = false;
//         main();
//     }
// });

main();
// $(function() {
//     main();
// });

// $(document).ready(function() {
//     main();
// });
//function
function elfunction(uPosition, uPoliceCalls, uCalls){
    if($(".MarginLeft4for12pt")[0] != null){
        $(".MarginLeft4for12pt")[0].textContent = uPosition;
        $(".MarginLeft5for12pt")[0].textContent = '自動' + uCalls + '；警用 ' + uPoliceCalls;
        $(".MarginLeft5for12pt")[1].textContent = '自動' + $(".MarginLeft5for12pt")[1].textContent;
    }
}

const findItemB = $item => new Promise((resolve, reject) => {
    if ($item.length === 0) reject();
    // 有可能此时 .item-b 已经出现，所以先检查下
    const $itemB = $item.find('[class="k-widget k-window k-display-inline-flex k-window-formbox"]');
    if ($itemB.length > 0) {
        resolve($itemB);
        return;
    }
    // 监视 .item 的 DOM 树 childList 变化
    new MutationObserver((mutations, self) => {
        mutations.forEach(({ addedNodes }) => {
            addedNodes.forEach(node => {
                if (node.className !== 'k-widget k-window k-display-inline-flex k-window-formbox') return;
                self.disconnect();
                resolve($(node));
            });
        });
    }).observe($item[0], { childList: true });
});

function addel(uPosition, uPoliceCalls, uCalls){
    let toolnav = document.querySelector(".btn-holder.nav-list");
    let el = document.createElement('button');
    el.setAttribute('style', 'visibility: visible; display: inline !important;');
    // el.setAttribute('data-placement', 'top');
    el.setAttribute('data-toggle', 'tooltip');
    el.setAttribute('title', '');
    el.setAttribute('class', 'btn disable-display');
    // el.setAttribute('data-speed-group', 'documnettool');
    // el.setAttribute('data-speed-editstyle', 'addposition');
    el.setAttribute('data-original-title', '插入職稱');
    el.innerHTML = '<i class="k-i-pencil"></i>'
    
    console.log(uPosition, uCalls + '；警用 ' + uPoliceCalls);
    el.onclick = function(){elfunction(uPosition, uPoliceCalls, uCalls);};
    toolnav.appendChild(el);
}
// main
function main(){
    console.log("tool6 Running!");

    // var
    let uName = GM_getValue("uName", -1);
    let uPass = GM_getValue("uPass", -1);
    let uPosition = GM_getValue("uPosition", -1);
    let uPoliceCalls = GM_getValue("uPoliceCalls", -1);
    let uCalls = GM_getValue("uCalls", -1);

    if(uName == -1){
        let slider = document.createElement("div");
        slider.className = "swal-content";
        let c = document.createElement("input");
        c.id = "uName";
        c.className = "swal-content__input";
        c.placeholder = "帳號";
        slider.appendChild(c);
        slider.appendChild(document.createElement("br"));
        c = document.createElement("input");
        c.id = "uPass";
        c.className = "swal-content__input";
        c.placeholder = "密碼";
        slider.appendChild(c);
        slider.appendChild(document.createElement("br"));
        c = document.createElement("input");
        c.id = "uPosition";
        c.className = "swal-content__input";
        c.placeholder = "全稱(beta)";
        slider.appendChild(c);
        slider.appendChild(document.createElement("br"));
        c = document.createElement("input");
        c.id = "uCalls";
        c.className = "swal-content__input";
        c.placeholder = "自動電話";
        slider.appendChild(c);
        slider.appendChild(document.createElement("br"));
        c = document.createElement("input");
        c.id = "uPoliceCalls";
        c.className = "swal-content__input";
        c.placeholder = "警用電話";
        slider.appendChild(c);
        slider.appendChild(document.createElement("br"));

        swal({
            title: "請輸入帳號、密碼、全稱(beta)、自動電話、警用電話",
            content: slider,
            buttons: true,
        }).then((re) => {
            if(re){
                uName = document.getElementById("uName").value;
                uPass = document.getElementById("uPass").value;
                uPosition = document.getElementById("uPosition").value;
                uCalls = document.getElementById("uCalls").value;
                uPoliceCalls = document.getElementById("uPoliceCalls").value;
                if(uName != "" && uPass != "" && uPosition != "" && uCalls != "" && uPoliceCalls != ""){
                    console.log(uCalls, uName, uPass, uPoliceCalls, uPosition);
                    GM_setValue("uName", uName);
                    GM_setValue("uPass", uPass);
                    GM_setValue("uPosition", uPosition);
                    GM_setValue("uCalls", uCalls);
                    GM_setValue("uPoliceCalls", uPoliceCalls);
                    swal("Good job!", "You Can!", "success");
                }else{
                    swal("Oh No!", "You Cann't!", "error");
                }
            }
        });
    }

    

    //main
    if(document.getElementsByTagName('h2')[0] ? document.getElementsByTagName('h2')[0].innerHTML === '登入系統：員工入口網' : 0){

        console.log(uName, uPass);
        document.getElementById('ID').value = uName;
        document.getElementById('PW').value = uPass;
        document.getElementById('verifycode').value = 9487;
        document.getElementsByTagName('li')[4].innerHTML = "<button type='button' class='btn btn-primary' onclick='" + 'javascript: document.getElementById("loginFrom").submit();' + "' id='nologin'>免驗證登入</button>"
        let li1 = document.createElement('li');
        li1.innerHTML = "<button type='button' class='btn btn-primary' id='editperson'>你484忘記自己的密碼?</button>"

        let ul1 = document.querySelectorAll("ul[class='ButtonBlock']")[0];
        ul1.appendChild(li1);

        $('#editperson').on('click', function (e) {
            swal({
                title: "你是誰?",
                text: "你知道你在做什麼嗎!",
                buttons: {
                    cancel: "回家睡覺",
                    uName: {
                        text: "帳號",
                        value: "帳號",
                    },
                    uPass: {
                        text: "密碼",
                        value: "密碼",
                    },
                    uPosition: {
                        text: "全稱(beta)",
                        value: "全稱(beta)",
                    },
                    uCalls: {
                        text: "自動電話",
                        value: "自動電話",
                    },
                    uPoliceCalls: {
                        text: "警用電話",
                        value: "警用電話"
                    }
                },
                dangerMode: true,
            }).then((willDelete) => {
                if (willDelete == "帳號") {
                    swal({
                        title:"你的"+willDelete+"是:"+uName,
                        text: "你想修改嗎?在下面輸入你的新咚咚八",
                        content: "input",
                        dangerMode: true,
                    }).then((re) => {
                        if(re)
                            GM_setValue("uName", re);
                        $('#editperson').click();
                    });
                } else if(willDelete == "密碼"){
                    swal({
                        title:"你的"+willDelete+"是:"+uPass,
                        text: "你想修改嗎?在下面輸入你的新咚咚八",
                        content: "input",
                        dangerMode: true,
                    }).then((re) => {
                        if(re)
                            GM_setValue("uPass", re);
                        $('#editperson').click();
                    });
                } else if(willDelete == "全稱(beta)"){
                    swal({
                        title:"你的"+willDelete+"是:"+uPosition,
                        text: "你想修改嗎?在下面輸入你的新咚咚八",
                        content: "input",
                        dangerMode: true,
                    }).then((re) => {
                        if(re)
                            GM_setValue("uPosition", re);
                        $('#editperson').click();
                    });
                } else if(willDelete == "自動電話"){
                    swal({
                        title:"你的"+willDelete+"是:"+uCalls,
                        text: "你想修改嗎?在下面輸入你的新咚咚八",
                        content: "input",
                        dangerMode: true,
                    }).then((re) => {
                        if(re)
                            GM_setValue("uCalls", re);
                        $('#editperson').click();
                    });
                } else if(willDelete == "警用電話"){
                    swal({
                        title:"你的"+willDelete+"是:"+uPoliceCalls,
                        text: "你想修改嗎?在下面輸入你的新咚咚八",
                        content: "input",
                        dangerMode: true,
                    }).then((re) => {
                        if(re)
                            GM_setValue("uPoliceCalls", re);
                        $('#editperson').click();
                    });
                }
            });
        })
    
        
    }else if(document.getElementsByTagName('li')[1] ? document.getElementsByTagName('li')[1].innerHTML === '密碼變更' : 0){
        console.log('chang password page');
        let button = document.querySelector("#changeBtn");
        button.addEventListener(
            "click",
            function () {
                GM_setValue("uName", document.getElementById('ID').value);
                GM_setValue("uPass", document.getElementById('NEW_PW').value);
                console.log('succes');
            },
            false
        );
        document.getElementById('ID').value = uName;
        document.getElementById('PW').value = uPass;
    }else if(document.getElementsByTagName('title')[0] ? document.getElementsByTagName('title')[0].innerHTML === 'SPEED Super Desk' : 0){
        
        console.log('edit document');
        GM_addStyle(".disable-display { \
            display: inline !important; \
          }");
        addel(uPosition, uPoliceCalls, uCalls);
        
        $('body').click(async ({ target }) => {
            //迫使匹配所有字串及電子公文附件上傳
            //$tablist = $('[data-speed-id=TabList]');
            //$tablist.data('Module').AttachmentCheckParticularSymbol="/.*/";

            if ($('div[data-speed-action="InsertOpinion1"]')[0] == null ||  $('div[data-speed-action="InsertOpinion5"]')[0]) return;
            let fn = document.querySelectorAll("div[class='btn-group nav-list']")[1];

            let fn1 = document.createElement('div');
            fn1.setAttribute('class', 'btn');
            fn1.setAttribute('data-speed-action', 'InsertOpinion5');
            fn1.innerText = '以稿代簽。'
            fn.appendChild(fn1);

            let fn2 = document.createElement('div');
            fn2.setAttribute('class', 'btn');
            fn2.setAttribute('data-speed-action', 'InsertOpinion6');
            fn2.innerText = '擬:陳閱後文存。'
            fn.appendChild(fn2);

            $(function () { $("[data-toggle='tooltip']").tooltip(); });
            $('[data-speed-action^=InsertOpinion]').on('click', function (e) {
                $('#flow-opinion-input')[0].textContent = this.textContent
            })
        });
    }

    $('body').click(async ({ target }) => {
        if ($('[data-own-action^=InsertOpinion]')[0]) return;
        const $itemB = await findItemB($('body:hover'));
        // $('[class="k-widget k-window k-display-inline-flex k-window-formbox"]').click(alert(1));

        let fn = document.querySelectorAll("div[class='fields-value']")[3];
        let fn1 = document.createElement('div');
        fn1.setAttribute('class', 'btn');
        fn1.setAttribute('data-own-action', 'InsertOpinion1');
        fn1.innerText = '可'
        fn.appendChild(fn1);

        let fn2 = document.createElement('div');
        fn2.setAttribute('class', 'btn');
        fn2.setAttribute('data-own-action', 'InsertOpinion2');
        fn2.innerText = '如擬'
        fn.appendChild(fn2);

        let fn3 = document.createElement('div');
        fn3.setAttribute('class', 'btn');
        fn3.setAttribute('data-own-action', 'InsertOpinion3');
        fn3.innerText = '發'
        fn.appendChild(fn3);

        $('[data-own-action^=InsertOpinion]').on('click', function (e) {
            $('#DecisionDescription')[0].textContent = this.textContent
        });

        if($('#ApplicationLimit').siblings('span').children("span")[0].innerText == "開放"){
            $('#ApplicationLimit')[0].value = 'R';
            $('#ApplicationLimit')[0].selectedIndex = 3;
            $('#ApplicationLimit').siblings('span').children("span")[0].innerText = "限制開放";
        }
        
        if($('#ClassificationNumberIdentityList').siblings('span').children("span")[0].innerText == '請選擇分類號' && false){
            $("#ClassificationNumberIdentityList").off();
            $("#ClassificationNumberIdentityList").empty();
            $('#ClassificationNumberIdentityList').prepend(new Option('230199 (刑事_綜合業務,5年)', "558", true));
            $('#ClassificationNumberIdentityList').get(0).selectedIndex = 0;
            $('#ClassificationNumberIdentityList').val("558").trigger("change");
            
            $('#ClassificationNumberIdentityList').siblings('span').children("span")[0].innerText = '230199 (刑事_綜合業務,5年)';

            $("#FolderNumber").empty();
            $('#FolderNumber').prepend(new Option('1 - 刑事_綜合業務', "1", true));
            $('#RetentionPeriod').val("5");
            
        }else{
            console.log("X");
        }

        if($('#Quantity').val() == '0'){
            $('#Quantity').val(1);
            $('#QuantityUnit')[0].value = '2';
            $('#QuantityUnit')[0].selectedIndex = 2;
            $('#QuantityUnit').siblings('span').children("span")[0].innerText = "件";
        }
    });
}
