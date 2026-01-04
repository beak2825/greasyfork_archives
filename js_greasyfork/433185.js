// ==UserScript==
// @name         Menu Hack Takepoint.io
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  this allows you to log in while playing the game, log out also allows you to modify your vision and change the text of the points
// @author       Guzmán11
// @match        https://takepoint.io
// @grant        none
// @license      xD
// @downloadURL https://update.greasyfork.org/scripts/433185/Menu%20Hack%20Takepointio.user.js
// @updateURL https://update.greasyfork.org/scripts/433185/Menu%20Hack%20Takepointio.meta.js
// ==/UserScript==
let menu=`
<link href="https://fonts.googleapis.com/css?family=Orbitron:900" rel="stylesheet">
<style>
    #menu{
    display: flex;
    flex-direction: row;
    position: absolute;
    margin-left: 3px;
    margin-top: 57px;
    }
    .row{
    background:#686868c4;
    width: 350px;
    z-index:50;
    height: 530px;
    text-align: center;
    padding: 10px;
    margin-top: 35px;
    margin-left: 40px;
    box-shadow: inset 0px 0px 5px grey;
    border-radius: 6px;
    }
    .h1{
    color:#fff;
    font-size:24px;
    font-family:'orbitron';
    }
    .boton{
    width: 80%;
    height:55px;
    background:#8bc34a;
    border:0px;
    border-radius:10px;
    color:#fff;
    font-family:'orbitron';
    font-size:20px;
    }
    .input-menu{
    width:80%;
    border:0px;
    height:35px;
    margin-top:3px;
    border-radius:10px;
    text-align:center;
    outline:none;
    }
    .sub-titulo{
    font-family: 'Orbitron';
    font-size: 22px;
    color: #fff;
    }
    #view{
    text-align:center;
    }
    #div-servers{
    display: flex;
    justify-content: center;
    margin-top: -10px;
    }

    .boton-abrir{
     width: 90px;
    height: 40px;
    border-radius: 0px;
    border: 0px;
    margin-top: 35px;
    background: #686868c4;
    border-radius: 6px;
    margin-left: 45px;
    color: #fff;
    font-family: 'orbitron';
    font-weight: bold;
    }
    .x{
    position: absolute;
    font-family: 'orbitron';
    font-weight: bold;
    color: #fff;
    display: block;
    }
    #abrir{
    position:absolute;
    z-index:20;
    }
    .servers{
    margin-top: 25px;
    width: 130px;
    height: 40px;
    margin-left: 15px;
    border-radius: 7px;
    color: #fff;
    font-size: 18px;
    border: 0px;
    background: #8bc34a;
    }
</style>

<div id="todo-contenido" style="
    width: 414px;
    height: 660px;
"><div id="abrir" style="width: 453px;text-align: center;">
    <button style="
    margin-left: 0px;
" class="boton-abrir" onclick="document.getElementById('row-1').style.display=''; document.getElementById('row-2').style.display='none'; document.getElementById('row-3').style.display='none'">Menu 1</button>
    <button onclick="document.getElementById('row-1').style.display='none'
    document.getElementById('row-2').style.display=''
    document.getElementById('row-3').style.display='none'" id="br2" class="boton-abrir">Menu 2</button>
    <button onclick="document.getElementById('row-1').style.display='none'
    document.getElementById('row-2').style.display='none'
    document.getElementById('row-3').style.display='';" id="br3" class="boton-abrir">Menu 3</button>

</div>
<div id="menu">
    <div class="row" id="row-1" style="display: none;" role="row-1">
    <span class="x" onclick="document.getElementById('row-1').style.display='none'
    document.getElementById('row-2').style.display='none'
    document.getElementById('row-3').style.display='none';">X</span>
    <h1 class="h1">Play</h1>
    <button class="boton" id="play">Click</button>
    <h2 class="sub-titulo" style="
    margin-top: 10px;
">username</h2>
    <input maxlength="12" class="input-menu" id="username-menu">
    <h2 class="sub-titulo">password</h2>
    <input type="password" class="input-menu" id="password-menu">
    <button class="boton" style="margin-top:25px;" id="login-menu">Login</button>
    <h1 class="h1">Logout</h1>
    <button class="boton" style="margin-top:0px;" id="logout" onclick="logout()">Click</button>
</div>
<div class="row" id="row-2" style="display: none;" role="row-2">
    <span class="x" onclick="document.getElementById('row-1').style.display='none'
    document.getElementById('row-2').style.display='none'
    document.getElementById('row-3').style.display='none';">X</span>
    <h2 class="sub-titulo">username</h2>
    <input maxlength="12" class="input-menu" id="username-register">
    <h2 class="sub-titulo">Gmail</h2>
    <input class="input-menu" id="gmail-register">
    <h2 class="sub-titulo">password</h2>
    <input type="password" class="input-menu" id="password-register">
    <button class="boton" style="margin-top:25px;" id="register-button">Register</button>
    <h1 class="h1">Servers</h1>
    <div id="div-servers">
    <button onclick="switchServer('Dallas|tak-dal-usn3i.io-8.com')" class="servers">
        Usa
    </button>
    <button onclick="switchServer('Frankfurt|tak-fra-g2ril.io-8.com')" class="servers">
        Europe
    </button>
</div>
</div>
<div class="row" id="row-3" role="row-3" style="">
    <span class="x" onclick="document.getElementById('row-1').style.display='none'
    document.getElementById('row-2').style.display='none'
    document.getElementById('row-3').style.display='none';">X</span>
    <h1 class="h1" style="margin-top: 20px;">View Hack</h1>
    <input maxlength="4" style="margin-top:0px;" class="input-menu" id="view" title="recommendation: do not put more than 1.7k or less than 1.1k">
    <button class="boton" style=" margin-top: 40px;" id="view-button">View</button>
    <h2 class="h1" style="margin-top:40px;">points text</h2>
    <button class="boton" id="puntos">Random</button>
    <h2 class="sub-titulo" style="margin-top:30px;">Stop</h2>
    <button class="boton" id="stop">Click</button>
</div>
</div>
`
let numtest=909999900;
let id=document.querySelector("body");
id.id="body";
let body=document.getElementById('body');
let main_div=document.createElement("div");
main_div.innerHTML=menu;
body.prepend(main_div)
let play=document.getElementById("play");
play.addEventListener("click",function(){
    //connection.send("s")
    eg();
})
let loginMenu=document.getElementById("login-menu");
loginMenu.addEventListener("click",function(){
    Module.loginUser(document.getElementById("username-menu").value,document.getElementById("password-menu").value,document.querySelector("#rememberMe").checked)
})
let registerMenu=document.getElementById("register-button");
registerMenu.addEventListener("click",function(){
    Module.registerUser(document.getElementById("username-register").value,document.getElementById("gmail-register").value,document.getElementById("password-register").value)
})
let view=document.getElementById("view-button");
view.addEventListener("click",function(){
    HEAP32[10035]=document.getElementById("view").value; 
    HEAP32[10036]=document.getElementById("view").value;
})
let cheque=false;
let randomNumPoints;
let idx=1225;
let intervaloPuntos;
function cambiarPuntosFunction(){
    for( i= 1225; i <= 1231; i++){
        randomNumPoints=Math.floor(Math.random() *  numtest);
        HEAP32[i]=randomNumPoints;
    }
}
let puntos=document.getElementById("puntos")
puntos.addEventListener("click",function(){
    if(cheque == false){
    cheque = true;
    intervaloPuntos=setInterval(()=>{cambiarPuntosFunction()},0)
    }
});
let parar=document.getElementById("stop");
parar.addEventListener("click",function(){
    if(cheque == true){
        cheque = false;
    clearInterval(intervaloPuntos)
    }
})

//Nitrogem35 is very rat