// ==UserScript==
// @name         BS Notification
// @namespace    https://bs.to/
// @version      4.3.1
// @description  Benachrichtigung bei Erwähnung in der SB oder einer neuen PN und Userauswahl mit @ in der SB
// @author       Asu_nyan
// @match        https://bs.to/*
// @match        https://burningseries.co/*
// @icon         https://bs.to/favicon.ico
// @grant        none
// @require      https://greasyfork.org/scripts/375096-bs-library/code/BS_Library.js?version=651891
// @downloadURL https://update.greasyfork.org/scripts/30919/BS%20Notification.user.js
// @updateURL https://update.greasyfork.org/scripts/30919/BS%20Notification.meta.js
// ==/UserScript==
const BS = window.BS;
let username = BS.Module.Get('.navigation strong').innerText;
let alternatives = [`@${username}`];
let userpattern = `(${ alternatives.join('|') })`;
let regex = new RegExp(userpattern, "ig");
let posts = BS.Module.Get('#sbPosts');
posts.addEventListener("DOMNodeInserted", (a,b) => {
    if(a.target.localName == "dd" && regex.test(a.target.innerHTML))
    {
        occurrence();
        let datauser = a.target.previousSibling.dataset.user;
        let time = a.target.previousSibling.getElementsByTagName('time')[0].innerText;
        let title = (datauser != undefined) ? datauser : "Du wurdest erwähnt.";
        let options = {
            body: a.target.innerText + "\r\n" + time,
            icon: "https://bs.to/favicon.ico",
        };
        new Notification(title, options);
    }
});

if (!Array.prototype.remI) {
	let ars = ["Array", "HTMLCollection"];
	for (let i = 0; i < ars.length; i++) {
		Object.defineProperty(eval(ars[i]).prototype, "remI", {
			enumerable: false,
			value: function (index) {
				for (let i = 0; i < this.length; i++) {
					if (i > index) {
						this[i - 1] = this[i];
					}
				}
				this.length--;
			}
		});
		Object.defineProperty(eval(ars[i]).prototype, "f", {
			enumerable: false,
			value: function findArray(f, equal = false, path = "", first = true) {
				let index = -1;
				for (let i = 0; i < this.length; i++) {
					if (equal) {
						if (f === eval("this[i]" + path)) {
							index = i;
							if (first) {
								return index;
							}
						}
					} else {
						if (f.toString().indexOf(eval("this[i]" + path)) > -1) {
							index = i;
							if (first) {
								return index;
							}
						}
					}
				}
				return index;
			}
		});
	}
}

(function() {
    'use strict';
    if (Notification.permission !== 'denied' || Notification.permission === 'default') {
        Notification.requestPermission((permission) => {
            if (permission === 'granted') {
                console.log(`Notification Permission: ${ permission }`);
            }
        });
    }
    setInterval(BS.PN.NotifyIfNew, 5000);
    occurrence();
    setTimeout(function(){
        let sB=BS.Module.Get('#sbMsg');
        let par=sB.parentElement;
        sB.oninput=function(a,b,c){
            let usercontainer=BS.Module.Get('#sbUser').children;
            let onlineNames=[];
            for(let i=par.children.length-1;i>-1;i--){
                if(par.children[i].localName==="li12"){
                    par.children[i].remove();
                }
            }
            for(let t=0;t<usercontainer.length;t++){
                if(sB.value.length>2){
                    if(sB.value.indexOf("@")>-1 && usercontainer[t].children[0].textContent.toLowerCase().indexOf(sB.value.split("@")[1].toLowerCase())===0){
                        onlineNames.push(usercontainer[t].children[0].textContent);
                    }
                }
            }
            var active=BS.Module.Get('#sbPosts').children;
            for(let t=0;t<active.length;t+=2){
                if(onlineNames.f(active[t].children[0].textContent)>-1){
                    onlineNames.remI(onlineNames.f(active[t].children[0].textContent,true));
                    onlineNames.push(active[t].children[0].textContent);
                }else{
                    if(sB.value.length>2&&sB.value.indexOf("@")>-1 && active[t].children[0].textContent.toLowerCase().indexOf(sB.value.split("@")[1].toLowerCase())===0){
                        onlineNames.push(active[t].children[0].textContent);
                    }
                }

            }
            sB.onl=onlineNames;
            sB.index=0;
            if(sB.value.length>2&&onlineNames.length>0){
                let field=document.createElement("li12");
                field.style.width="200px";
                let height=onlineNames.length*20+20;
                let top=sB.offsetTop-(height)-5;
                field.style.position="absolute";
                field.style.top=top+"px";
                field.style.height=height+"px";
                field.style.left=sB.offsetLeft+"px";
                field.style.background="white";
                field.style.border="rgb(100, 160, 255) 1.5px solid";
                field.style.borderRadius= "4px";
                sB.fie=field;
                for(let j=0;j<onlineNames.length;j++){
                    let username=document.createElement("el");
                    username.innerText=onlineNames[j];
                    username.style.position="absolute";
                    username.style.top=j*20+8+"px";
                    username.style.left=20+"px";
                    username.style.width="160px";
                    username.style.color="black";
                    field.append(username);
                }
                par.append(field);
            }
        };
        sB.onkeydown=function(a,b,c){
            if(a.keyCode===38||a.keyCode===40){
                if(sB.fie.children[sB.index]){
                    sB.fie.children[sB.index].style.backgroundColor="white";
                }
                function index(plus){
                    if(plus){
                        sB.index++;
                        if(sB.index>sB.onl.length-1){
                            sB.index=0;
                        }
                    }else{
                        sB.index--;
                        if(sB.index==-1){
                            sB.index=sB.onl.length-1;
                        }
                    }
                }
                if(sB.index===undefined){
                    sB.index=0;
                }
                if(a.keyCode===38){
                    index(false);
                }else{
                    index(true);
                }
                sB.fie.children[sB.index].style.backgroundColor="rgb(100, 160, 255)";
                sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[sB.index]+" ");
            }else if(a.keyCode===9){
                //tab
                if(sB.onl.length===1){
                    sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[0]+" ");
                }else{
                    sB.value=sB.value.replace(sB.value.split("@")[1].split(" ")[0],sB.onl[sB.onl.length-1]+" ");
                }
                for(let i=par.children.length-1;i>-1;i--){
                    if(par.children[i].localName==="li12"){
                        par.children[i].remove();
                    }
                }
                setTimeout(function(sB){
                    sB.focus();
                    sB.selectionStart=sB.value.length;
                    sB.selectionEnd=sB.value.length;
                },1,sB);
            }
            if(a.keyCode==13){
                return Shoutbox.checkEnter(a);
            }
        };
    },1000);
})();

function occurrence(){
    let posts = document.getElementById('sbPosts');
    let postsContent = posts.children;
    for(let i = 0; i < postsContent.length; i++){
        if(postsContent[i].localName == "dd"){
            postsContent[i].innerHTML = postsContent[i].innerHTML.replace(regex, "<i style='color:yellow'>@"+username+"</i>");
        }
    }
}