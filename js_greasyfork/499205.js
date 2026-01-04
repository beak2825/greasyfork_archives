// ==UserScript==
// @name         YGN WHOWHERE 2 included version
// @namespace    http://tampermonkey.net/
// @version      2024-06-27
// @description  install this script and visit: https://gartic.io/?ygnww2&lang=8
// @author       YGN
// @match        https://gartic.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gartic.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/499205/YGN%20WHOWHERE%202%20included%20version.user.js
// @updateURL https://update.greasyfork.org/scripts/499205/YGN%20WHOWHERE%202%20included%20version.meta.js
// ==/UserScript==

if(window.location.href.indexOf("?ygnww2")!=-1){
    window.location.href.indexOf("&lang=")!=-1?window.lang=window.location.href.split("&lang=")[1]:window.lang=8
    document.body.innerHTML=`<div class="users" style="display:flex !important;justify-content:center;align-items:center;flex-wrap:wrap;overflow-y:scroll;width:100%;height:100vh;background:#131313;color:white;"><div><h1>YGN WHOWHERE2 included LOADING...</h1></div></div>`

    function updateUsers(){
        document.querySelector(".users").innerHTML="<div><h3>YGN WHOWHERE2 included</h3></div>"
        window.players.forEach(user=>{
            if(user.foto!=undefined){
                document.querySelector(".users").innerHTML+=`
                <div style="margin:5px;border:1px solid #ccc;border-radius:3px;text-align:center;padding:5px;">
                    <img title="`+user.id+`" width="50" src="`+user.foto+`"><br>

                    <b>`+user.nick+`</b> <span>`+user.points+`p</span><br>
<a target="_blank" style="color:royalblue;" href="`+user.room+`">`+user.room.slice(8)+`</a><br>
<a target="_blank" style="color:royalblue;" href="`+user.room+`/viewer"><b>Viewer</b></a>
                </div>
            `
            }else{
                document.querySelector(".users").innerHTML+=`
                <div style="margin:5px;border:1px solid #ccc;border-radius:3px;text-align:center;padding:5px;">
                    <img title="`+user.id+`" width="50" src="https://gartic.io/static/images/avatar/svg/`+user.avatar+`.svg"><br>

                    <b>`+user.nick+`</b> <span>`+user.points+`p</span><br>
<a target="_blank" style="color:royalblue;" href="`+user.room+`">`+user.room.slice(8)+`</a><br>
<a target="_blank" style="color:royalblue;" href="`+user.room+`/viewer"><b>Viewer</b></a>
                </div>
            `
            }
        })
    }

    window.players=[]
    function getData(roomCode){
        //CHECK FOR SERVER01
        let ws1=new WebSocket("wss://server01.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws1.onopen=()=>{
            ws1.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws1.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws1.close()
                }
            }
        }
        //CHECK FOR SERVER02
        let ws2=new WebSocket("wss://server02.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws2.onopen=()=>{
            ws2.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws2.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws2.close()
                }
            }
        }
        //CHECK FOR SERVER03
        let ws3=new WebSocket("wss://server03.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws3.onopen=()=>{
            ws3.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws3.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws3.close()
                }
            }
        }
        //CHECK FOR SERVER04
        let ws4=new WebSocket("wss://server04.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws4.onopen=()=>{
            ws4.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws4.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws4.close()
                }
            }
        }
        //CHECK FOR SERVER05
        let ws5=new WebSocket("wss://server05.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws5.onopen=()=>{
            ws5.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws5.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws5.close()
                }
            }
        }
        //CHECK FOR SERVER06
        let ws6=new WebSocket("wss://server06.gartic.io/socket.io/?EIO=3&transport=websocket")
        ws6.onopen=()=>{
            ws6.send('42[12,{"v":20000,"platform":0,"sala":"'+roomCode.slice(-4)+'"}]')
        }
        ws6.onmessage=(msg)=>{
            if(msg.data[4]=="5"){
                let data=JSON.parse(msg.data.slice(2))
                if(data[0]==5){
                    console.log(data)
                    data[5].forEach(user=>{
                        window.players.push({"points":user.pontos,"victory":user.vitorias,"id":user.id,"avatar":user.avatar,"room":"https://gartic.io/"+roomCode,"nick":user.nick,"foto":user.foto})
                    })
                    updateUsers()
                    ws6.close()
                }
            }
        }
    }
    fetch("https://gartic.io/req/list?search=&language[]="+window.lang).then(x=>x.json()).then(x=>{
        x.forEach(room=>{
            if(room.quant>0){
                getData(room.code)
            }
        })
    })
}

