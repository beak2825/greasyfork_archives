
(function() {
    'use strict';

    var c = document.getElementById('canvas');
    var ctx = c.getContext("2d");
    var c2 = document.createElement('canvas');
    var ctx2 = c2.getContext('2d');
    var c3 = document.createElement('canvas');
    var ctx3 = c3.getContext('2d');
    c2.width = c.width;
    c2.height = c.height;
    c3.width = c.width;
    c3.height = c.height;
    document.getElementsByTagName('body')[0].appendChild(c2);
    document.getElementsByTagName('body')[0].appendChild(c3);
    c2.style.position = "absolute";
    c2.style.top = "0px";
    c2.style.left = "0px";
    c2.style.zIndex = -1;
    c3.style.position = "absolute";
    c3.style.top = "0px";
    c3.style.left = "0px";
    c3.style.zIndex = -2;
    c2.style.filter = "blur(10px) contrast(0%) saturate(0%) brightness(20%)";
    window.addEventListener("resize", function() {
        c2.width = c.width;
        c2.height = c.height;
        c3.width = c.width;
        c3.height = c.height;
    }, false);
    var mP = { x: 0, y: 0 };
    window.addEventListener("mousemove", function(e) {
        mP = { x: e.clientX, y: e.clientY };
    }, false);
    c.style.opacity = 1;
    var i = 0;
    var shaderButton = document.createElement('button');
    document.getElementsByTagName('body')[0].appendChild(shaderButton);
    shaderButton.style = "position:absolute; top:10px; left:10px;";
    shaderButton.innerHTML = "On";
    shaderButton.onclick = function() {input.set_convar('ren_background', false);}
    function loop1() {
        i++;
        ctx3.fillStyle = "hsl(0, 0%, 90%)";
        ctx3.fillRect(0, 0, c2.width, c2.height);
        ctx2.clearRect(0, 0, c2.width, c2.height);
        ctx2.drawImage(c, 20, 20);
        setTimeout(loop1, 1000 / 30);
    }
    loop1();
})();
