// ==UserScript==
// @name         Read All iMails
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一鍵閱讀所有Eclass iMails
// @author       HKquiet, discord: hkquiet
// @match        https://*/home/imail/viewfolder.php*
// @match        https://*/home/imail/viewmail.php*
// @icon         https://inet.kyc.edu.hk/images/2020a/iMail/icon_open_mail.gif
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @downloadURL https://update.greasyfork.org/scripts/487949/Read%20All%20iMails.user.js
// @updateURL https://update.greasyfork.org/scripts/487949/Read%20All%20iMails.meta.js
// ==/UserScript==
var go = 0;
var toastPos = 5;
var toastsList = [];
var toastTypeColour = {
    'message':'#4aaed9',
    'error':'#d95d4a',
    'success':'#4ad958'
};
let toastStyle = document.createElement('style');
toastStyle.innerHTML = `
.toast {
    visibility: hidden;
    position: fixed;
    border-radius: 10px;
    text-align: center;
    color: white;
    right:1%;
    padding: 10px;
}
.toast[name="In"] {
    visibility: visible;
    animation: AMtoastIn 0.3s, AMtoastOut 0.3s 2s;
}
@keyframes AMtoastIn {
    from {top: 95%; opacity: 0;}
    to {opacity: 9;}
}
@keyframes AMtoastOut {
    from {opacity: 9;}
    to {opacity: 0;}
}`;
document.body.appendChild(toastStyle);

(function() {
    if(GM_getValue("Reading") == true){main();}
    let btn= document.createElement("button");
    btn.innerHTML = "Read All";
    if ((GM_getValue("Reading") == null)&&(window.location.pathname == "/home/imail/viewfolder.php")){document.getElementsByClassName("imailpagetitle")[0].parentElement.appendChild(btn);}
    btn.addEventListener("click", ()=>{
        GM_setValue("Reading",true);
        btn.remove();
        main();
    });
})();
function main(){
    let mailsRem = "";
    try{mailsRem = document.getElementsByClassName("menuon")[2].innerHTML.split("(")[1].split(")")[0];}catch(e){mailsRem = 0}
    let pages = document.getElementsByClassName('formtextbox')[0].children;
    let CurrentPage;
    for(let i = 0;i<pages.length;i++) {
        if(pages[i].selected) {
            CurrentPage = i+1;
            break;
        }
    }
    toastAdd("Reading iMails..."+mailsRem+" iMails remaining",'message');
    toastAdd("Page "+CurrentPage.toString()+" of "+pages.length.toString(),'message');
    let mails = document.getElementsByClassName("iMailsubjectunread");
    let mailsSender = document.getElementsByClassName("iMailsender");
    let row = document.getElementsByClassName("iMailrow");
    if(mails.length!=0){for(let i=0;i<mails.length;i++){mark(mails[i].href,mails[i].innerText,mailsSender[i].innerText);}}
    let nextPg = document.getElementById("page_next");
    let nextPgL = nextPg.parentElement;
    const goLoop = setInterval(()=>{if(go==mails.length){if(nextPgL.href != null){clearInterval(goLoop);nextPgL.click()}else{GM_deleteValue("Reading");clearInterval(goLoop);toastAdd("All iMails have been Read.",'message')}}},100);
}
function mark(url,name,sender){
    if(name.length > 15) name.substring(0,15)+"...";
    fetch(url).then((r)=>{
        if(!r.ok){
            toastAdd("Failed to Read '"+name+"', Retrying...",'error');
            mark(url,name,sender);
        }else{
            go+=1;
            toastAdd("["+go+"]Read '"+name+"' From '"+sender+"'");
        }
    })
}

function toastAdd(msg,type="success") {
    let newToast = document.createElement("div");
    newToast.className = "toast";
    newToast.innerText = msg;
    newToast.style.backgroundColor = toastTypeColour[type];
    newToast.style.top = toastPos.toString()+"px"
    toastPos += 45;
    document.body.appendChild(newToast);
    toastsList.push(newToast);
    newToast.setAttribute('name','In');
    setTimeout(()=>{
        toastPos-=45;
        newToast.remove();
        toastsList.shift();
        toastsList.forEach(toasts => {
            toasts.style.top = (parseInt(toasts.style.top.split("%")[0])-45).toString()+"px"
        });
    },2300);
}
