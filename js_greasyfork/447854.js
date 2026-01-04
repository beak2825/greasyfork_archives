// ==UserScript==
// @name				Hackzin Do Slower Pro Kogama
// @run-at			    document-start
// @version		     	2.0
// @description     	hack du kogama
// @author		     	Slower
// @match				https://www.kogama.com/page/webgl-frame/*
// @match				https://kogama.com.br/page/webgl-frame/*
// @match				https://friends.kogama.com/page/webgl-frame/*
// @grant				none
// @namespace           none
// @icon                https://yt3.ggpht.com/8e0B0NkTflIcVOsqhv-NkQQXvuP73oDTpyxZa2kXL5AMKj9NuP2xqnDPokyaUNClOkn-moaBtQA=s88-c-k-c0x00ffffff-no-rj-mo
// @downloadURL https://update.greasyfork.org/scripts/447854/Hackzin%20Do%20Slower%20Pro%20Kogama.user.js
// @updateURL https://update.greasyfork.org/scripts/447854/Hackzin%20Do%20Slower%20Pro%20Kogama.meta.js
// ==/UserScript==
 
/*sniffers*/
alert("Seu Console Ligou!")
alert("Bora Hackear hehe")
WS_Original = WebSocket;
WebSocket = function(url, type){
    let ws = new WS_Original(url, type);
    kcc.ws = ws;
 
    ws._send = ws.send;
    ws.send = kcc.injectClient;
    kcc.logClient('injected client');
    function waitServer(e){
        kcc.injectServer(e);
        if(!this.editServer){
            this.removeEventListener('message', waitServer);
            this._msg = this.onmessage;
            this.onmessage = kcc.injectServer;
        }
        kcc.logServer('injected server');
    }
    ws.addEventListener('message', waitServer);
 
    return ws;
};
 
/*Utils*/
Uint8Array.prototype.equals=
    Array.prototype.equals=function(array){
    if(!(array&&this.length==array.length))return false;
    for(var i=0,l=this.length;i<l;i++){
        if(this[i] instanceof Array&&array[i] instanceof Array){
            if(!this[i].equals(array[i]))return false;
        }else if(this[i]!=array[i]){return false;}
    }
    return true;
}
Object.defineProperty(window.Uint8Array.prototype,"equals",{enumerable:false});
Object.defineProperty(window.Array.prototype,"equals",{enumerable:false});
decode=d=>new TextDecoder().decode(d);
encode=d=>new TextEncoder().encode(d);
top.toByte16=toByte16=num=>new Uint8Array(new Uint16Array([num]).buffer).reverse();
top.toNum16Sign=toNum16Sign=nums=>new Int16Array(new Uint8Array(nums).reverse().buffer)[0];
top.toNum16=toNum16=nums=>new Uint16Array(new Uint8Array(nums).reverse().buffer)[0];
top.unsign16=unsign16=num=>new Uint16Array([num])[0];
top.toByte32=toByte32=num=>new Uint8Array(num?new Uint32Array([num]).buffer:[]).reverse();
top.toNum32=toNum32=nums=>new Uint32Array(nums?new Uint8Array(nums).reverse().buffer:0)[0];
getJSON=str=>{
    let pos=0,left=0,i=0,arr=[];
    while(i++<str.length){
        if(str[i]=='{'&&str[i+1]=='"'){
            if(!left)pos=i;
            left++;
        }
        if(str[i]=='}'){
            if(left>0){
                left--;
                if(!left)arr.push(str.slice(pos,i+1));
            }
        }
    }
    return arr.map(a=>JSON.parse(a));
}
top.format=format=str=>{//ff0011->[255,0,17]
    let rez=[];
    let n=0;
    for(let i=0;i<str.length;i++){
        rez.push(str[i]);
        if((i+2-n)%3==0){n+=2;rez.push(" ");}
    }
    rez.pop();
    return new Uint8Array(rez.join('').split(' ').map(n=>parseInt(n,16)))
};
const proto = WebSocket.prototype;
proto._send = proto.send;
proto.send = function(data) {
  const bytes = new Uint8Array(data);
  console.log(bytes);
  this._send(data);
};
 
/*kogama console*/
{
    window.html=top.html=id=>top.document.getElementById(id);
    window.make=top.make=tag=>top.document.createElement(tag);
    window.kc=top.kc={green:'#75E175',red:'#000000',blue:'#FFA200',redteam:'#FF0000',whiteteam:'#FFFFFF',blueteam:'#0008FF',yellowteam:'#F3FF00',greenteam:'#46FF00',purple:'#6C3483',darkred:'#922B21',darkblue:'#154360',
                      cubegun:()=>{
                          kcc.ws._send(new Uint8Array([
                              243,2,25,0,2,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,4,115,0,4,116,121,112,101,105,0,0,0,11,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,8,105,116,101,109,68,97,116,97,68,0,0,0,1,115,0,8,109,97,116,101,114,105,97,108,98,20
                          ]));
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,4,115,0,4,116,121,112,101,105,0,0,0,11,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,8,105,116,101,109,68,97,116,97,68,0,0,0,1,115,0,8,109,97,116,101,114,105,97,108,98,20,254,105,0,0,0,0
                          ]).buffer});
                      },
                      Impulsegun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,2,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,2,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,9,97,110,105,109,97,116,105,111,110,68,0,0,0,2,115,0,5,115,116,97,116,101,115,0,4,73,100,108,101,115,0,9,116,105,109,101,83,116,97,109,112,105,70,131,252,232,254,105,0,0,0,0
                          ]).buffer});
                      },
                      Bazooka:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,4,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      autofire:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,8,105,115,70,105,114,105,110,103,111,1,254,105,0,0,0,0
                          ]).buffer});
                      },
                      Pistol:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,12,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      mousegun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,60,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      healgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,70,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shotgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,9,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      centralgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,1,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      railgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,6,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      sword:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,8,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      growthgun:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,2,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,62,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,9,97,110,105,109,97,116,105,111,110,68,0,0,0,2,115,0,5,115,116,97,116,101,115,0,4,73,100,108,101,115,0,9,116,105,109,101,83,116,97,109,112,105,80,15,108,52,254,105,0,0,0,0
                          ]).buffer});
                      },
                      pistol2x:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,13,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      flamethrower:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,10,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shuriken:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,45,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      shuriken5x:()=>{
                          kcc.ws._msg({data:new Uint8Array([
                              243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,46,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,254,105,0,0,0,0
                          ]).buffer});
                      },
                      levelup:()=>{
        kcc.ws._msg({data:new Uint8Array([
        243,4,94,0,2,245,115,0,31,123,34,108,101,118,101,108,71,111,108,100,82,101,119,97,114,100,115,34,58,123,34,49,51,34,58,49,48,56,125,125,254,105,0,0,0,1
        ]).buffer});
        },
        goldhack:()=>{kcc.ws._msg({data:new Uint8Array([243,4,95,0,2,245,115,0,29,123,34,108,101,118,101,108,34,58,49,51,44,34,103,111,108,100,82,101,119,97,114,100,34,58,57,57,57,125,254,105,0,0,0,1]).buffer});},
        setLevel1:(level=1, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel2:(level=2, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel3:(level=3, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel4:(level=4, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel5:(level=5, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel6:(level=6, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel7:(level=7, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel8:(level=8, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel9:(level=9, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel10:(level=10, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel11:(level=11, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel12:(level=12, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel13:(level=13, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel14:(level=14, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel15:(level=15, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel16:(level=16, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel17:(level=17, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel18:(level=18, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel19:(level=19, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel20:(level=20, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel21:(level=21, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel22:(level=22, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                            setLevel23:(level=23, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                                                        setLevel24:(level=24, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel25:(level=25, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel26:(level=26, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel27:(level=27, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel28:(level=28, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel29:(level=29, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel30:(level=30, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel31:(level=31, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel32:(level=32, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel33:(level=33, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel34:(level=34, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel35:(level=35, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel36:(level=36, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel37:(level=37, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel38:(level=38, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel39:(level=39, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel40:(level=40, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel41:(level=41, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel42:(level=42, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel43:(level=43, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel44:(level=44, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },                                            setLevel45:(level=45, actorNr)=>{
        kcc.ws.send(new Uint8Array([243,2,56,0,1,169,105,...toByte32(level)]))
        kcc.ws._msg({data:new Uint8Array([243,4,55,0,2,169,105,...toByte32(level),254,105,...toByte32(actorNr)]).buffer})
        },
                      shield:()=>{
        kcc.ws._msg({data:new Uint8Array([
        243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,9,109,111,100,105,102,105,101,114,115,68,0,0,0,2,115,0,26,95,84,105,109,101,65,116,116,97,99,107,70,108,97,103,68,101,98,114,105,101,102,83,108,111,119,98,0,115,0,16,95,83,112,97,119,110,80,114,111,116,101,99,116,105,111,110,98,0,254,105,0,0,0,0
        ]).buffer});
        },
                      ringeffect:()=>{
           var effectID = 1;
                for(var boss = 0; boss < 20; effectID++){
                    kcc.ws._msg({data:new Uint8Array([
                        243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,9,109,111,100,105,102,105,101,114,115,68,0,0,0,effectID,115,0,9,95,83,104,105,101,108,100,101,100,98,0,254,105,0,0,0,0
                    ]).buffer});
                    if(effectID > 20){
                        break;
                    }
                }
		},
                       nitro:()=>{
        kcc.ws._msg({data:new Uint8Array([
        243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,1,115,0,9,109,111,100,105,102,105,101,114,115,68,0,0,0,1,115,0,9,95,78,105,110,106,97,82,117,110,98,0,254,105,0,0,0,0
        ]).buffer});
		},
                       freezeAni:()=>{
            kcc.ws._msg({data:new Uint8Array([
                243,4,29,0,3,22,105,...toByte32(kcc.self),70,68,0,0,0,2,115,0,11,99,117,114,114,101,110,116,73,116,101,109,68,0,0,0,3,115,0,4,116,121,112,101,105,0,0,0,16,115,0,9,118,97,114,105,97,110,116,73,100,105,0,0,0,0,115,0,15,117,112,100,97,116,101,73,116,101,109,83,116,97,116,101,105,0,0,0,4,115,0,9,97,110,105,109,97,116,105,111,110,68,0,0,0,2,115,0,5,115,116,97,116,101,115,0,4,73,100,108,101,115,0,9,116,105,109,101,83,116,97,109,112,105,70,131,252,232,254,105,0,0,0,0
            ]).buffer});
        },
                      fly1:() => {
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);},
 		              big:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,17])),
                      crash:() => {for (var i = 0; i < 9999 * 2; i++) {kcc.ws.send(new Uint8Array([243,2,15,0,0,0,1,53,...toByte32(999)]))}},
                      action:(actionId,PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,actionId])),
                      freeze:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,11])),
                      damadge:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,10])),
                      heal:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,27])),
                      small:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,16])),
                      mutant_kill:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,6])),
                      rail_kill:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,2,27,0,2,22,105,...toByte32(PID),83,68,0,0,0,1,98,0,120,0,0,0,2,1,4])),
                      invisible:(PID=kcc.self)=>kcc.ws.send(new Uint8Array([243,4,2,0,8,22,105,0,3,...toByte32(PID),70,68,0,0,0,1,115,0,17,115,112,97,119,110,82,111,108,101,77,111,100,101,84,121,112,101,105,0,0,0,4])),
                      finish:()=>kcc.ws.send(new Uint8Array([243,2,23,0,1,191,105,0,3,0,0])),
                      team:()=>kcc.ws.send(new Uint8Array([243,2,29,0,1,89,105,0,0,0,1])), //change to red team
                      teamg:()=>kcc.ws.send(new Uint8Array([243,2,29,0,1,89,105,0,0,0,2])), //change to green team
                      teamy:()=>kcc.ws.send(new Uint8Array([243,2,29,0,1,89,105,0,0,0,3])), //change to yellow team
                      teamb:()=>kcc.ws.send(new Uint8Array([243,2,29,0,1,89,105,0,0,0,0])), //change to blue team
                      teamw:()=>kcc.ws.send(new Uint8Array([243,2,29,0,1,89,105,0,0,0,5])), //change to white team
                      log:(msg,clr='#FFF')=>{
                          if(html('console_log').lastChild&&msg==html('console_log').lastChild.textContent){
                              let counter=html('console_log').lastChild.children[0];
                              if(counter){
                                  counter.value=1+Number(counter.value);
                              }else{
                                  counter=make('input');
                                  counter.style=`height:20px;width:20px;
					text-align:center;padding:0px;
					background:${kc.green};color:#FFFA;
					border:none;border-radius:100%;cursor:default;`;
                                  counter.value=2;
                                  counter.disabled=true;
                                  html('console_log').lastChild.appendChild(counter)
                              }
                              return;
                          }
                          let scroll=html('console_log').scrollTop/(html('console_log').scrollHeight-html('console_log').offsetHeight);
                          if(isNaN(scroll)||scroll>0.9)scroll=true;
                          else scroll=false;
                          let el=make('div');
                          el.style='padding:2% 1% 0px 2%;width:100%;color:'+clr+';';
                          el.textContent=msg;
                          html('console_log').appendChild(el);
                          if(scroll)html('console_log').scrollTop=html('console_log').scrollHeight-html('console_log').offsetHeight;
                      },
                      command:str=>{
                          kc.log(str,'#FFF8');
                      }
                     };
    window.makeCheat=top.makeCheat=(name='unknown',clr='#888',func=()=>{})=>{
        let el=make('input');
        el.id=name;
        el.value=name;
        el.className='cheat_element';
        el.type='button';
        el.style=`color:${clr};background-color:#4f545c;border-radius:10px;border:none;padding:2px;`;
        el.addEventListener('click',func);
        html('cheat_box').appendChild(el);
    };
    window.addBB=top.addBB=(name='unknown',id='unknown',box='unknown_box',choosen=0)=>{
        let el=make('div');
        el.id=box;
        el.style=`
			position:absolute;
			display:${choosen?'block':'none'};
			width:75%;height:90%;
			top:10%;
			right:0px;
		`;
        html('console').appendChild(el);
        el=make('div');
        el.id='console_bar_'+id;
        el.className='bar_element bar_element_'+(choosen?'on':'off');
        el.textContent=name;
        el.addEventListener('click',function(e){
            if(this!=html('console_bar').cur){
                html(box).style.display='block';
                html('console').cur.style.display='none';
                html('console').cur=html(box);
                this.className='bar_element bar_element_on';
                html('console_bar').cur.className='bar_element bar_element_off';
                html('console_bar').cur=this;
            }
        });
        html('console_bar').appendChild(el);
    };
    var sheet=top.document.head.appendChild(make('style')).sheet;
    sheet.insertRules=rules=>rules.replace(/\}/g,'}^').split('^').map(r=>(r.indexOf('{')+1)&&sheet.insertRule(r));
    sheet.insertRules(`
		.scroller{overflow-y:auto;}
		.scroller::-webkit-scrollbar{
			width:10px;
		}
		.scroller::-webkit-scrollbar-thumb{
			background-color:rgba(0,0,0,.4);
			-webkit-box-shadow:inset 0 0 2px rgba(0,0,0,.5);
			box-shadow:inset 0 0 2px rgba(0,0,0,.5);
		}
		.scroller::-webkit-scrollbar-track{
			background-color:rgba(0,0,0,.3);
		}
		.scroller::-webkit-scrollbar-thumb{
			background:#000;
		}
		.bar_element:hover{
			opacity:0.9;
			background:#40444bAA;
			transition-duration: 0.3s;
		}
		.bar_element{
			color:#FFF;
			line-height: 200%;
			cursor:pointer;
			height:10%;
			width:100%;
		}
		.cheat_element:hover{
			color:#FFF !important;
		}
		.bar_element_off{
			opacity:0.5;
			background:#0000;
		}
		.bar_element_on{
			opacity:1;
			background:#ABADB4;
		}
	`);
    let el=make('div');
    top.document.body.appendChild(el);
    el.id='console';
    el.style=`
		position:fixed;
		display:none;
		z-index:9999;
		background-color:#E6E9EE;
		text-align:center;
		border-radius:10px;
		border:3px #36393F solid;
	`;
    top.addEventListener('resize',function(){
        html('console').style.width=top.outerWidth*0.35+'px';
        html('console').style.height=top.outerHeight*0.35+'px';
    });
    top.dispatchEvent(new Event('resize'));
    top.document.addEventListener('mouseup',e=>{
        if(html('console').movement){
            html('console').movement=false;
            e.preventDefault();
            e.stopPropagation();
        }
    })
    top.document.addEventListener('mousemove',e=>{
        if(html('console').movement){
            html('console').style.left=(html('console').startPos.x+e.x-html('console').startPos.mx)+'px';
            html('console').style.top=(html('console').startPos.y+e.y-html('console').startPos.my)+'px';
            if(html('console').offsetTop<0)html('console').style.top='0px';
            e.preventDefault();
            e.stopPropagation();
        }
    });
    top.document.addEventListener('contextmenu', e=>{
        if(e.target==top.document.querySelector('#profile-extended-toggle>a>i')){
            html('console').style.display='block';
            e.preventDefault();
        }
    });
    el=make('div');
    el.id='console_head';
    el.innerHTML='Hack Do Slower Top';
    el.style=`
		width:100%;height:10%;
		background-color:#9595A4;
		cursor:default;
		border-top-left-radius:10px;
		border-top-right-radius:10px;
	`;
    html('console').appendChild(el);
    html('console_head').addEventListener('mousedown',e=>{
        html('console').movement=true;
        html('console').startPos={x:html('console').offsetLeft,y:html('console').offsetTop,mx:e.x,my:e.y};
        e.preventDefault();
        e.stopPropagation();
    });
    el=make('input');
    el.id='console_close';
    el.type='button';
    el.value='Close';
    el.style=`
		position:absolute;
		height:10%;width:10%;
		right:0px;
		background-color:${kc.blue};
		color:#FFF;line-height:0.5;
		border:none;
		border-top-right-radius:10px;
	`;
    html('console_head').appendChild(el);
    html('console_close').addEventListener('mousedown',e=>{
        if(e.which==1){
            pos={x:html('console').offsetLeft,y:html('console').offsetTop};
            html('console').style.display='none';
            html('console').style.left=pos.x+'px';
            html('console').style.top=pos.y+'px';
        }
        e.preventDefault();
        e.stopPropagation();
    });
    el=make('div');
    el.id='console_bar';
    el.style=`
		position:absolute;
		top:10%;left:0px;
		width:25%;height:90%;
		background-color:#2f3136;
	`;
    html('console').appendChild(el);
 
    addBB('Console','console','console_box',1);
    html('console').appendChild(el);
    el=make('input');
    el.id='console_input';
    el.placeholder='Enter command...';
    el.style=`
		position:absolute;
		width:95%;height:10%;
		bottom:2.5%;right:2.5%;
		background-color:#4f545c;
		border:none;color:#FFF8;
		border-radius:15px;
		text-align:center;
		cursor:text;
	`;
    html('console_box').appendChild(el);
    html('console_input').index=-1;
    html('console_input').old=[];
    html('console_input').addEventListener('keydown',function(e){
        switch(e.keyCode){
            case 13:
                if(this.value){
                    kc.command(this.value);
                    if(this.old[this.old.length-1]!=this.value)this.old.push(this.value);
                    if(this.old>30)this.old.splice(0,1);
                    this.was=undefined;
                    this.index=this.old.length;
                    this.value='';
                }
                break;
            case 38://up
                this.index-=2;
            case 40://down
                this.index++;
                if(this.index>this.old.length-1)this.index=this.old.length;
                if(this.index<0)this.index=0;
                if(this.index>this.old.length-1){
                    if(this.was!==undefined)this.value=this.was;
                    this.was=undefined;
                }else{
                    if(this.was===undefined)this.was=this.value;
                    this.value=this.old[this.index];
                }
                break;
        }
});
    el=make('div');
    el.id='console_log';
    el.className='scroller';
    el.style=`
    position:absolute;
		text-align:left;
		width:100%;height:85%;
		word-break:break-all;
	`;
    html('console_box').appendChild(el);
 
    html('console').cur=html('console_box');
    html('console_bar').cur=html('console_bar_console');
 
    addBB('Cheat List','list','cheat_box');
    html('cheat_box').className='scroller';
    makeCheat('finish',kc.blue,()=>kc.finish());
    makeCheat('mutant kill',kc.red,()=>Object.keys(kcc.names).map(n=>kcc.self!=kcc.names[n]&&kc.mutant_kill(kcc.names[n])));
    makeCheat('rail kill',kc.red,()=>Object.keys(kcc.names).map(n=>kcc.self!=kcc.names[n]&&kc.rail_kill(kcc.names[n])));
    makeCheat('autodamadge',kc.red,()=>{
        if(kc.idDamadge){clearInterval(kc.idDamadge);kc.idDamadge=0;}
        else kc.idDamadge=setInterval(()=>Object.keys(kcc.names).map(n=>kc.damadge(kcc.names[n])),5e2);
    });
    makeCheat('autofreeze',kc.green,()=>{
        if(kc.idFreeze){clearInterval(kc.idFreeze);kc.idFreeze=0;}
        else kc.idFreeze=setInterval(()=>Object.keys(kcc.names).map(n=>kc.freeze(kcc.names[n])),5e2);
    });
    makeCheat('AutoShot',kc.darkyellow,()=>{
        if(kc.idHealqa){clearInterval(kc.idHealqa);kc.idHealqa=0;}
        else kc.idHealqa=setInterval(()=>Object.keys(kcc.names).map(n=>kc.autofire(kcc.self[n])),1e1);
    });
    makeCheat('autobig',kc.green,()=>{
        if(kc.idBig){clearInterval(kc.idBig);kc.idBig=0;}
        else kc.idBig=setInterval(()=>Object.keys(kcc.names).map(n=>kc.big(kcc.names[n])),5e2);
    });
    makeCheat('autospawn-impulsegun',kc.green,()=>{
        if(kc.idImpulsegun){clearInterval(kc.idImpulsegun);kc.idImpulsegun=0;}
        else kc.idImpulsegun=setInterval(()=>Object.keys(kcc.names).map(n=>kc.Impulsegun(kcc.names[n])),5e2);
    });
    makeCheat('autosmall',kc.green,()=>{
        if(kc.idSmall){clearInterval(kc.idSmall);kc.idSmall=0;}
        else kc.idSmall=setInterval(()=>Object.keys(kcc.names).map(n=>kc.small(kcc.names[n])),5e2);
    });
    makeCheat('rapid bazooka 2',kc.black,()=>{
        if(kc.healqa){clearInterval(kc.healqa);kc.healqa=0;}
        else kc.healqa=setInterval(()=>Object.keys(kcc.names).map(n=>kc.Bazooka (kcc.self[n])),1e1);
    });
    makeCheat('rapid pistol 2(50-60fps)',kc.black,()=>{
        if(kc.healqa){clearInterval(kc.healqa);kc.healqa=0;}
        else kc.healqa=setInterval(()=>Object.keys(kcc.names).map(n=>kc.Pistol (kcc.self[n])),1e1);
    });
     makeCheat('autohealme',kc.green,()=>{
        if(kc.idHeal){clearInterval(kc.idHeal);kc.idHeal=0;}
        else kc.idHeal=setInterval(()=>Object.keys(kcc.names).map(n=>kc.heal(kcc.self[n])),2e2);
	});
    makeCheat('autohealall',kc.green,()=>{
		if(kc.idHeal){clearInterval(kc.idHeal);kc.idHeal=0;}
		else kc.idHeal=setInterval(()=>Object.keys(kcc.names).map(n=>kc.heal(kcc.names[n])),2e2);
	});
 
    ;
        makeCheat('heal',kc.green,()=>kc.heal());
        document.addEventListener('keydown',e=>{
            switch(e.key){
                case '0':
                    kc.cubegun();
                    break;
                case 'F':
                    kc.Impulsegun();
                    break;
                case 'G':
                    kc.Bazooka();
                    break;
                case 'R':
                    kc.Pistol();
                    break;
                case 'E':
                    kc.shuriken();
                    break;
                case 'R':
                    kc.shuriken5x();
                    break;
                case 'T':
                    kc.mousegun();
                    break;
                case 'Y':
                    kc.healgun();
                    break;
                case 'U':
                    kc.shotgun();
                    break;
                case 'I':
                    kc.centralgun();
                    break;
                case 'P':
                    kc.railgun();
                    break;
                case 'J':
                    kc.sword();
                    break;
                case 'L':
                    kc.growthgun();
                    break;
                case 'Z':
                    kc.flamethrower();
                    break;
                case '/':
                    if(kc.idHealqa){clearInterval(kc.idHealqa);kc.idHealqa=0;}
                    else kc.idHealqa=setInterval(()=>Object.keys(kcc.names).map(n=>kc.autofire(kcc.self[n])),1e1);
                    break;
                case 'Delete':
    var spamEncoder = new TextEncoder();
                var spamCode = spamEncoder.encode('<size=9999>SLOWER < </size>');
                var spamCode2 = spamEncoder.encode('<size=9999>SLOWER < </size>');
                var spamCode3 = spamEncoder.encode('<size=9999>SLOWER< </size>');
                var spamCode4 = spamEncoder.encode('<size=9999>SLOWER < </size>');
                var spamCode5 = spamEncoder.encode('<size=9999>SLOWER < </size>');
                var spamCode6 = spamEncoder.encode('<size=9999>SLOWER < </size>');
    var spamLength = spamCode.length
    var spamLength2 = spamCode2.length
    var spamLength3 = spamCode3.length
    var spamLength4 = spamCode4.length
    var spamLength5 = spamCode5.length
    var spamLength6 = spamCode6.length
    var spammer = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength,...spamCode];
    var spammer2 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength2,...spamCode2];
    var spammer3 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength3,...spamCode3];
    var spammer4 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength4,...spamCode4];
    var spammer5 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength5,...spamCode5];
    var spammer6 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength6,...spamCode6];
    kcc.ws.send(new Uint8Array(spammer))
    kcc.ws.send(new Uint8Array(spammer2))
    kcc.ws.send(new Uint8Array(spammer3))
    kcc.ws.send(new Uint8Array(spammer4))
    kcc.ws.send(new Uint8Array(spammer5))
    kcc.ws.send(new Uint8Array(spammer6))
            break;
                case '*':
    var spamEncoder = new TextEncoder();
                var spamCode = spamEncoder.encode('<color=#000000>===Slower CHEGO==</color>');
                var spamCode2 = spamEncoder.encode('<color=#0101DF>===Slower CHEGO===</color>');
                var spamCode3 = spamEncoder.encode('<color=red>===Slower CHEGO===</color>');
                var spamCode4 = spamEncoder.encode('<color=#01DF01>===Slower CHEGO===</color>');
                    var spamCode5 = spamEncoder.encode('<color=#D7DF01>===Slower CHEGO===</color>');
                var spamCode6 = spamEncoder.encode('<color=#FFFFFF>===Slower  CHEGO===</color>');
                var spamCode7 = spamEncoder.encode('<color=#000000>===Slower  CHEGO===</color>');
                var spamCode8 = spamEncoder.encode('<color=#0101DF>===Slower  CHEGO===</color>');
                var spamCode9 = spamEncoder.encode('<color=red>===Slower  CHEGO===</color>');
                var spamCode10 = spamEncoder.encode('<color=#01DF01>===Slower  CHEGO===</color>');
                var spamCode11 = spamEncoder.encode('<color=#D7DF01>===Slower  CHEGO===</color>');
                var spamCode12 = spamEncoder.encode('<color=#FFFFFF>===Slower  CHEGO===</color>');
                var spamCode13 = spamEncoder.encode('<color=#000000>===Slower  CHEGO===</color>');
                var spamCode14 = spamEncoder.encode('<color=#0101DF>===Slower  CHEGO===</color>');
                var spamCode15 = spamEncoder.encode('<color=red>===Slower  CHEGO===</color>');
                var spamCode16 = spamEncoder.encode('<color=#01DF01>===Slower  CHEGO===</color>');
                var spamCode17 = spamEncoder.encode('<color=#D7DF01>===Slower CHEGO===</color>');
                var spamCode18 = spamEncoder.encode('<color=#FFFFFF>===Slower CHEGO===</color>');
    var spamLength = spamCode.length
    var spamLength2 = spamCode2.length
    var spamLength3 = spamCode3.length
    var spamLength4 = spamCode4.length
    var spamLength5 = spamCode5.length
    var spamLength6 = spamCode6.length
    var spamLength7 = spamCode7.length
    var spamLength8 = spamCode8.length
    var spamLength9 = spamCode9.length
    var spamLength10 = spamCode10.length
    var spamLength11 = spamCode11.length
    var spamLength12 = spamCode12.length
    var spamLength13 = spamCode7.length
    var spamLength14 = spamCode8.length
    var spamLength15 = spamCode9.length
    var spamLength16 = spamCode10.length
    var spamLength17 = spamCode11.length
    var spamLength18 = spamCode12.length
    var spammer = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength,...spamCode];
    var spammer2 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength2,...spamCode2];
    var spammer3 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength3,...spamCode3];
    var spammer4 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength4,...spamCode4];
    var spammer5 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength5,...spamCode5];
    var spammer6 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength6,...spamCode6];
    var spammer7 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength7,...spamCode7];
    var spammer8 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength8,...spamCode8];
    var spammer9 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength9,...spamCode9];
    var spammer10 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength10,...spamCode10];
    var spammer11 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength11,...spamCode11];
    var spammer12 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength12,...spamCode12];
    var spammer13 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength7,...spamCode7];
    var spammer14 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength8,...spamCode8];
    var spammer15 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength9,...spamCode9];
    var spammer16 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength10,...spamCode10];
    var spammer17 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength11,...spamCode11];
    var spammer18 = [243,2,88,0,2,87,105,0,0,0,3,88,68,0,0,0,2,98,0,105,0,0,0,1,98,5,115,0,spamLength12,...spamCode12];
    kcc.ws.send(new Uint8Array(spammer))
    kcc.ws.send(new Uint8Array(spammer2))
    kcc.ws.send(new Uint8Array(spammer3))
    kcc.ws.send(new Uint8Array(spammer4))
    kcc.ws.send(new Uint8Array(spammer5))
    kcc.ws.send(new Uint8Array(spammer6))
    kcc.ws.send(new Uint8Array(spammer7))
    kcc.ws.send(new Uint8Array(spammer8))
    kcc.ws.send(new Uint8Array(spammer9))
    kcc.ws.send(new Uint8Array(spammer10))
    kcc.ws.send(new Uint8Array(spammer11))
    kcc.ws.send(new Uint8Array(spammer12))
    kcc.ws.send(new Uint8Array(spammer13))
    kcc.ws.send(new Uint8Array(spammer14))
    kcc.ws.send(new Uint8Array(spammer15))
    kcc.ws.send(new Uint8Array(spammer16))
    kcc.ws.send(new Uint8Array(spammer17))
    kcc.ws.send(new Uint8Array(spammer18))
            break;
                case '!':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                 case '+':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.pistol2x(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.pistol2x(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.pistol2x(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.pistol2x(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.pistol2x(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                case '@':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Bazooka(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                case '9':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.shotgun(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                case '6':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.sword(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                case '7':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.cubegun(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                     case '4':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.growthgun(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                    case '2':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.mousegun(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                 case '3':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.shuriken(), 1);
setTimeout(kc.autofire(), 1);
                    break;
                case '~':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
 
                    break;
                case '>':
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Bazooka(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.Pistol(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.shotgun(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.cubegun(), 1);
setTimeout(kc.autofire(), 1);
setTimeout(kc.Impulsegun(), 1);
setTimeout(kc.shuriken(), 1);
setTimeout(kc.autofire(), 1);
 
                    break;
 
            }
        });
 
        makeCheat('Air-hop',kc.redteam,()=>alert('Hotkey=!') ());//E
        makeCheat('Air-hop2',kc.redteam,()=>alert('Hotkey=+') ());//E
        makeCheat('Ultra-rapid shotgun',kc.redteam,()=>alert('Hotkey=9') ());//E
        makeCheat('Ultra-rapid sword',kc.redteam,()=>alert('Hotkey=6') ());//E
        makeCheat('Ultra-rapid cubegun',kc.redteam,()=>alert('Hotkey=7') ());//E
        makeCheat('Ultra-rapid growthgun',kc.redteam,()=>alert('Hotkey=4') ());//E
        makeCheat('Ultra-rapid growthgun',kc.redteam,()=>alert('Hotkey=2') ());//E
        makeCheat('Ultra-rapid shuriken',kc.redteam,()=>alert('Hotkey=3') ());//E
        makeCheat('Crash-server',kc.red,()=>kc.crash());
        makeCheat('=========spawn-weapons=========',kc.whiteteam,()=>kc.none())
        makeCheat('shiriken',kc.red,()=>alert('Hotkey=E') ());//E
        makeCheat('shuriken x5',kc.red,()=>alert('Hotkey=R')()); //R
        makeCheat('mouse-gun',kc.red,()=>alert('Hotkey=T')()); //T
        makeCheat('heal-gun',kc.red,()=>alert('Hotkey=Y')()); //Y
        makeCheat('shot-gun',kc.red,()=>alert('Hotkey=U')());  //U
        makeCheat('central-gun',kc.red,()=>alert('Hotkey=I')());//I
        makeCheat('rail-gun',kc.red,()=>alert('Hotkey=P')()); //P
        makeCheat('sword',kc.red,()=>alert('Hotkey=J')()); //J
        makeCheat('growth-gun',kc.red,()=>alert('Hotkey=L')()); //L
        makeCheat('flamethrower',kc.red,()=>alert('Hotkey=Z')()); //Z
        makeCheat('Impulsegun',kc.red,()=>alert('Hotkey=F')());
        makeCheat('Bazooka',kc.red,()=>alert('Hotkey=G')());
        makeCheat('Pistol',kc.red,()=>alert('Hotkey=R')());
        makeCheat('============cube-gun============',kc.whiteteam,()=>kc.none())
        makeCheat('cubegun',kc.red,()=>kc.cubegun());
        makeCheat('cubenormal',kc.blue,()=>kcc.cubeMode=0);
        makeCheat('cubeplane',kc.blue,()=>kcc.cubeMode=1);
        makeCheat('cubegiant',kc.blue,()=>kcc.cubeMode=2);
        makeCheat('cuberoom',kc.blue,()=>kcc.cubeMode=3);
        makeCheat('cubexm',kc.blue,()=>kcc.cubeMode=4);
        makeCheat('cubexp',kc.blue,()=>kcc.cubeMode=5);
        makeCheat('cubezm',kc.blue,()=>kcc.cubeMode=6);
        makeCheat('cubezp',kc.blue,()=>kcc.cubeMode=7);
        makeCheat('normal',kc.blue,()=>kcc.cubeId=0);
        makeCheat('==============colors==============',kc.whiteteam,()=>kc.none())
        makeCheat('superbounce',kc.purple,()=>kcc.cubeId=kcc.superbounce);
        makeCheat('ice',kc.purple,()=>kcc.cubeId=kcc.ice);
        makeCheat('poison',kc.purple,()=>kcc.cubeId=kcc.poison);
        makeCheat('magma',kc.purple,()=>kcc.cubeId=kcc.magma);
        makeCheat('bounce',kc.purple,()=>kcc.cubeId=kcc.bounce);
        makeCheat('blackice',kc.purple,()=>kcc.cubeId=kcc.blackice);
        makeCheat('scrolling',kc.purple,()=>kcc.cubeId=kcc.scrolling);
        makeCheat('test',kc.purple,()=>kcc.cubeId=kcc.reda);
        makeCheat('==============team==============',kc.whiteteam,()=>kc.none())
        makeCheat('team blue',kc.blueteam,()=>kc.teamb());
        makeCheat('team red',kc.redteam,()=>kc.team());
        makeCheat('team green',kc.greenteam,()=>kc.teamg());
        makeCheat('team yellow',kc.yellowteam,()=>kc.teamy());
        makeCheat('team white',kc.whiteteam,()=>kc.teamw());
        makeCheat('==============effects==============',kc.whiteteam,()=>kc.none())
        makeCheat('shield',kc.blue,()=>kc.shield());
        makeCheat("ringeffect",kc.blue,()=>kc.ringeffect());
        makeCheat('boost',kc.blue,()=>kc.nitro());
        makeCheat('freezeAnimation',kc.darkred,()=>{
		   if(kc.idfreezeAni){clearInterval(kc.idfreezeAni);kc.idfreezeAni=0;}
		   else kc.idfreezeAni=setInterval(()=>Object.keys(kcc.names).map(n=>kcc.self!=kcc.names[n]&&kc.freezeAni(kcc.names[n])),5e2);
	   });
        makeCheat('you',kc.whiteteam,()=>window.open("https://www.kogama.com/profile/me/")());//new
        makeCheat('================levels================',kc.whiteteam,()=>alert('levels visible to other players') ());//E
        makeCheat('LevelUp',kc.blue,()=>kc.levelup());
        makeCheat('noLevel',kc.blue,()=>{
        if(kc.idsetLevel1){clearInterval(kc.idsetLevel1);kc.idsetLevel1=0;}
        else kc.idsetLevel=setInterval(()=>Object.keys(kcc.names).map(n=>kc.setLevel1(kcc.names[n])),5e2);
        if(kc.idsetLevel2){clearInterval(kc.idsetLevel2);kc.idsetLevel2=0;}
        else kc.idsetLevel2=setInterval(()=>Object.keys(kcc.names).map(n=>kc.setLevel2(kcc.names[n])),5e2);
    });
        makeCheat('Level 1',kc.blueteam,()=>kc.setLevel1());
        makeCheat('Level 6',kc.purple,()=>kc.setLevel6());
        makeCheat('Level 11',kc.greenteam,()=>kc.setLevel11());
        makeCheat('Level 16',kc.whiteteam,()=>kc.setLevel16());
        makeCheat('Level 21',kc.yellowteam,()=>kc.setLevel21());
        makeCheat('Level 26',kc.redteam,()=>kc.setLevel26());
        makeCheat('Level 31',kc.black,()=>kc.setLevel31());
        makeCheat('Level 36',kc.darkred,()=>kc.setLevel36());
        makeCheat('Level 41',kc.darkblue,()=>kc.setLevel41());
        makeCheat('Level 45',kc.darkblue,()=>kc.setLevel45());
 
    }
 
addBB('About','cheat_about','about_box');
	html('about_box').className='scroller';
	el=make('div');
	el.id='about_box_info';
	el.style.whiteSpace='pre';
	el.textContent=`
Helpers;
 Masterix  (bytes) <3 best friend!
 exnonull  (consoleMenu)
 piped     (questions)
 Lawlao    (questions)
 .AMiNE.   (code editing)⠀  ⠀  ⠀  ⠀  ⠀  ⠀  ⠀  ⠀  ⠀⠀⠀⠀⠀⠀⠀⠀⠀ `;
	html('about_box').appendChild(el);
 
 
/*cliente do slower*/
              window.kcc=top.kcc={
              ws:{},
        self:0,
            pos:[0,0,0],
                names:{},
                    parts:[],
                        cubeSize:4,
                            cubeD:1812,
                                superbounce:1846,
                                    poison:1820,
                                        blackice:1835,
                                            ice:1817,
                                              scrolling:1855,
                                                reda:1,
                                                magma:1818,
                                                    bounce:1819,
                                                        cubeId:0,
                                                            cubeXZ:10,
                                                                roomSize:4,
                                                                    cubeMode:0,
                                                                        cubeWay:50,
                                                                            cubeServer:(randomId=kcc.self,x=0,y=0,z=0,material)=>new Uint8Array([243,4,10,0,3,47,105,...toByte32(randomId),49,120,0,0,0,...(material?[9,2]:[7,0]),...toByte16(x),...toByte16(y),...toByte16(z),...(material?toByte16(material):[]),254,105,0,0,0,material?3:1]),
                                                                                cube:(randomId=kcc.self,x=0,y=0,z=0,material)=>new Uint8Array([243,2,7,0,2,47,105,...toByte32(randomId),49,120,0,0,0,...(material?[9,2]:[7,0]),...toByte16(x),...toByte16(y),...toByte16(z),...(material?toByte16(material):[])]),
                                                                                    logClient:(msg,...items)=>{
                                                                                        console.log.apply(console,['%c'+msg,"background-color:#0808;",...items]);
                                                                                    },
                                                                                        logServer:(msg,...items)=>{
                                                                                            console.log.apply(console,['%c'+msg,"background-color:#F808;",...items]);
                                                                                        },
                                                                                            injectClient:function(data){
                                                                                                data = new Uint8Array(data);
                                                                                                data = kcc.separator(data);
                                                                                                if(data)this._send(data);
                                                                                            },
                                                                                                injectServer:function(e){
                                                                                                    let data = new Uint8Array(e.data);
                                                                                                    if(this != kcc.ws){
                                                                                                        kcc.logServer(`wait injection: [${data.toString()}]`);
                                                                                                        return;
                                                                                                    }
                                                                                                    data = kcc.separator(data);
                                                                                                    if(data)this._msg({data:data.buffer});
                                                                                                }
};
 
/*requests separating*/
kcc.no_sense=data=>{
    if(data.length<7)return true;//not action
    return false;
 
 
}
 
kcc.separator=data=>{
    if(kcc.no_sense(data))return data;
 
    head = data.slice(0,7);//[243, (client:2|6, server:4|7), actionId(u32), 105]
    reqId = head.slice(2,6);
    /*
	2,6 - client
	4,7 - server
	*/
    source = (head[1]==2||head[1]==6)?"client":"server";
 
    return new Uint8Array([...head, ...kcc[source+"Separator"](toNum32(reqId), data.slice(7))]);
}
 
kcc.clientSeparator=(reqId,data)=>{
    switch(reqId){
        case 117441071://[7,0,2,47] 26->19 bytes
            let id=toNum32(data.slice(0,4));
            let material=toNum16(data.slice(17,19));
            let x=toNum16Sign(data.slice(11,13));
            let y=toNum16Sign(data.slice(13,15));
            let z=toNum16Sign(data.slice(15,17));
            //kc.log(`cubegun:{id:${id},x:${x},y:${y},z:${z},material:${material}}`,'#080');
            if(kcc.cubeMode){
                let arr=[];
                if(kcc.cubeMode==1){//plane
                    for(let i=x-kcc.cubeXZ;i<=x+kcc.cubeXZ;i++)
                        for(let i2=y-1;i2<=y-1;i2++)
                            for(let i3=z-kcc.cubeXZ;i3<=z+kcc.cubeXZ;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
                }else if(kcc.cubeMode==2){//giant
                    for(let i=x-kcc.cubeSize;i<=x+kcc.cubeSize;i++)
                        for(let i2=y-kcc.cubeSize;i2<=y+kcc.cubeSize;i2++)
                            for(let i3=z-kcc.cubeSize;i3<=z+kcc.cubeSize;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
                }else if(kcc.cubeMode==3){//room
                    for(let i=x-kcc.roomSize;i<=x+kcc.roomSize;i++)
                        for(let i2=y-1;i2<=y+kcc.roomSize*2-1;i2++)
                            for(let i3=z-kcc.roomSize;i3<=z+kcc.roomSize;i3++){
                                if(i==x-kcc.roomSize||i==x+kcc.roomSize||
                                   i2==y+kcc.roomSize*2-1||i2==y-1||
                                   i3==z-kcc.roomSize||i3==z+kcc.roomSize){
                                    arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                                }
                            }
                }else if(kcc.cubeMode==4){//xm
                    for(let i=x-kcc.cubeWay;i<=x;i++)
                        for(let i2=y-1;i2<=y-1;i2++)
                            for(let i3=z-2;i3<=z+2;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
                }else if(kcc.cubeMode==5){//xp
                    for(let i=x;i<=x+kcc.cubeWay;i++)
                        for(let i2=y-1;i2<=y-1;i2++)
                            for(let i3=z-2;i3<=z+2;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
                }else if(kcc.cubeMode==6){//zm
                    for(let i=x-2;i<=x+2;i++)
                        for(let i2=y-1;i2<=y-1;i2++)
                            for(let i3=z-kcc.cubeWay;i3<=z;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
                }else if(kcc.cubeMode==7){//zp
                    for(let i=x-2;i<=x+2;i++)
                        for(let i2=y-1;i2<=y-1;i2++)
                            for(let i3=z;i3<=z+kcc.cubeWay;i3++){
                                arr.push({x:unsign16(i),y:unsign16(i2),z:unsign16(i3)});
                            }
               }else if(kcc.cubeMode==8){//cubeprison
                    for(let y2=y-1;y2<=y+kcc.cubeheight;y2++)
                        for(let grad=0;grad<360;grad++){
                            let x2=unsign16(x+Math.floor(kcc.cubeprison*Math.cos(grad*Math.PI/180)));
                            let z2=unsign16(z+Math.floor(kcc.cubeprison*Math.sin(grad*Math.PI/180)));
                                if(!arr.find(v=>v.x==x2&&v.y==y2.z==z2))
                                    arr.push({x:x2,y:y2,z:z2});
                            }
                }
                arr.map((pos,i)=>{
                    kcc.ws._msg({data:kcc.cubeServer(id,pos.x,pos.y,pos.z,kcc.cubeId?kcc.cubeId:material).buffer});
                    kcc.ws._send(kcc.cube(id,pos.x,pos.y,pos.z,kcc.cubeId?kcc.cubeId:material));
                });
 
            }
            break;
        case 33556246://[2,0,7,22], 47->40 bytes
            //kc.log('moving','#080');
            //let PID=data.slice(0,4);//36 bytes
            kcc.pos=data.slice(4);
 
            break;
        case 16777473://[1,0,1,1]
            //kcc.logClient('ping time');//(11)
            break;
        case 4278192982://toNum32([255,0,11,86]):
            kc.log('login','#080');
            break;
        case 1040188095://toNum32([62,0,2,191]):
            kc.log('[image part]','#080');
            break;
        case 385876415://toNum32([23,0,1,191]):
            kc.log('finish','#080');
            break;
        case 419430934://toNum32([25,0,2,22]):
            //kcc.self=toNum32(data.slice(0,4));
            break;
        case 654311702://toNum32([39,0,1,22]):
            //kcc.logClient('add model to inventory');
            break;
        case 738198312://toNum32([44,0,3,40]):
            //kcc.logClient('push model to the marketplace');
            break;
        case 218104104://toNum32([13,0,1,40]):
            //kcc.logClient('delete model from inventory');
            break;
        case 452985366://toNum32([27,0,2,22]):
            //kcc.logClient('use effect on player');
            break;
    }
    return data;
}
kcc.serverSeparator=(reqId,data)=>{
    //server:243,4,10,0,3,47,105,...toByte32(randomId),49,120,0,0,0,9,2,...toNum16(x),...toNum16(y),...toNum16(z),7,material,254,105,0,0,0,3
 
    //client:243,2,7,0,2,47,105, 0,0,5,196,49,120,0,0,0,9,2,255,211,0,4,255,225
    //       243,4,10,0,3,47,105,0,0,5,207,49,120,0,0,0,7,0,255,229,0,4,255,213,254,105,0,0,0,1
 
    //243,4,86,0,5,220,105,0,0,41,254,219,98,2,209,105,0,0,0,0,85,105,0,0,0,10,254,105,0,0,0,1
    switch(reqId){
        case toNum32([10,0,3,47])://case toNum32([86,0,5,220]):
            //kc.log('cubegun another');
            break;
        case toNum32([1,0,0,42]):
            //kcc.logServer('ping time');//(20)
            break;
        case toNum32([255,0,6,89]):
            {
                top.keks=top.keks?top.keks:[];
                let info=getJSON(decode(data))[0];
                top.keks.push(info);
                //kc.log(`[${info.UserName}]->joining`,'#F80');
                kcc.parts.push(info.UserName);
            }
            break;
        case toNum32([104,0,2,245]):
            {
                top.keks=top.keks?top.keks:[];
                let info=getJSON(decode(data))[0];
                top.keks.push(info);
                let pid=info.SpawnRolesRuntimeData.activeSpawnRole;//.spawnRoleAvatarIds[0];
                let name=kcc.parts.pop();
                kc.log(`[${name},${pid}]->joined`,'#F80');
                kcc.names[name]=pid;
            }
            break;
        case toNum32([102,0,10,245]):case toNum32([61,0,10,245]):
            {
                kc.log('joined','#F80');
                let info=getJSON(decode(data));
                top.kek=info;
                kcc.self=info[info.length-1].spawnRolesDefaultTypeWoIDMap;
                kcc.self=kcc.self?kcc.self.DefaultPlayModeSpawnRole:info[info.length-1].DefaultPlayModeSpawnRole;
                info=info.slice(1,info.length-1);
                for(let k=0;k<info.length;k+=3){
                    kcc.names[info[k].UserName]=info[k+2].activeSpawnRole;
                }
                kc.log(`Player List:${JSON.stringify(kcc.names)}`,'#F80');
            }
            break;
        case toNum32([6,0,11,22]):
            {
                let id=toNum32(data.slice(0,4))-1;
                for(let k in kcc.names)if(kcc.names[k]==id){
                    kc.log(`[${k},${id}]->left`,'#F80');
                    delete kcc.names[k];break;
                }
            }
            break;
 
    }
 
    return data;
}
 
//Thanks for installing my Slower Hackzin 2.0!