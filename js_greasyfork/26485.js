// ==UserScript==
// @name         Humanatic Personal
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Añade funcionabilidades extras a humanatic!
// @author       Jose Enrique ayala Villegas
// @match        https://www.humanatic.com/pages/review.cfm
// @match        https://www.humanatic.com/pages/*
// @exclude      /^https://www.humanatic.com/pages/humfun/?/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/26485/Humanatic%20Personal.user.js
// @updateURL https://update.greasyfork.org/scripts/26485/Humanatic%20Personal.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...
setValue = GM_setValue;
getValue = GM_getValue;
//timeTitle(0,document.title);
function timeTitle(time,title){
    document.title = title + ": " + time;
    setTimeout(function(){timeTitle(time+1,title);},1000);
}
GM_setValue('autoreload',(GM_getValue('autoreload') !== undefined) ? GM_getValue('autoreload') : false);
if(document.getElementsByClassName('hcat_link').length > 0){
    GM_setValue('recent',new Date().getTime()); getStim(false);
    jQuery('.hcat_link').each(function(){
        this.onclick = function(){setValue('cat',this.href);};
    });
    catList = new Array();jQuery('a[class="hcat_link"]').each(function(e){
        cate= new Array();cate[0] = this.href;cate[1] = this.getElementsByTagName('b')[0].innerHTML;
        catList[catList.length] = cate;
    });
    setValue('catList',catList);
    if(GM_getValue('autoreload') == true){
        if(document.referrer.indexOf("https://www.humanatic.com/pages/categorize_nada.cfm") != -1){
            setTimeout(function(){
                //location.href = GM_getValue("cat");
                jQuery('.hcat_link').filter(function(e){
                    return this.href == getValue("cat");
                })[0].click();
            },1000);
        }
    }
    menuList();
} else {
    menuList();
    var po = document.getElementById('progress-output');
    if(po !== null){
        au = document.getElementsByTagName('audio')[1];
        input = document.createElement('input');
        input.type = "range";
        ctrs = document.getElementsByClassName('controls')[0];
        ctrs.insertBefore(input,ctrs.childNodes[8]);
        input.defaultValue = 10;
        input.style.marginLeft = "20px";
        input.max = 10;
        input.min = 5;
        input.value = 10;
        input.onchange = function(){au.playbackRate = this.value / 10;};
        po.scrollIntoView();
        CT(0);
        lista = Array.from(document.getElementsByClassName('mobile_options')).filter(function(e){return (e.style.display != "none"); });
        document.body.onkeypress = function(e){
            tecla = String.fromCharCode(e.keyCode); console.log(tecla);
            if(tecla >= 1 && tecla <= lista.length){
                lista.forEach(function(e){  e.style.borderStyle = ""; e.id = ""; e.style.backgroundColor = "";});
                lista[tecla -1].style.borderStyle = "solid";
                lista[tecla -1].style.borderColor = "#d0d0d0";
                lista[tecla -1].style.borderRadius = "10px";
                lista[tecla -1].style.backgroundColor = "#ededed";
                lista[tecla -1].id = "actual";
            } else if(e.keyCode == 13){
                es = document.getElementById("actual");
                es.getElementsByTagName('input')[0].click();
                return false;
            } else if(e.keyCode == 32){
                pp = document.getElementsByClassName('btn btn-primary button-play-pause')[0];
                pp.click();
                return false;
            }
        };
        document.body.onkeydown = function(e){
            if(e.keyCode == 37){
                if(typeof fle1_to !== 'undefined') clearTimeout(fle1_to);
                fle1 = true;
                if(e.ctrlKey){wavesurfer.skipBackward(3);} else {wavesurfer.skipBackward(1);}
                return false;
            } else if(e.keyCode == 39){
                if(typeof fle1_to !== 'undefined') clearTimeout(fle1_to);
                fle1 = true;
                if(e.ctrlKey){wavesurfer.skipForward(3);} else {wavesurfer.skipForward(1);}
                return false;
            }
        };
        document.body.onkeyup = function(e){
            if(e.keyCode == 37){
                fle1_to = setTimeout(function(){fle1 = false;fle1_to = undefined;},1000);

            } else if(e.keyCode == 39){
                fle1_to = setTimeout(function(){fle1 = false;fle1_to = undefined;},1000);
            }
        };
        omitir = document.createElement("button");
        omitir.style.marginLeft = "5px";
        omitir.className = "btn btn-primary button-mute";
        omitir.textContent = "OMITIR";
        omitir.onclick = function(){
            omitir.disabled = true;
            jQuery.get('https://www.humanatic.com/pages/multiple_calls.cfm?detect=s',function(r){
                h = document.createElement('html');
                h.innerHTML = r;
                if(jQuery('meta[http-equiv="refresh"]',h).length > 0){
                    jQuery.get("https://www.humanatic.com/pages/" + jQuery('meta[http-equiv="refresh"]',h)[0].content.split("URL=")[1],function(){
                        location.href = getValue("cat");
                    });
                } else {alert("No hay ninguna llamada registrada");}
            }).fail(function() {
                omitir.disabled = false;
            });
        };
        jQuery('input[type="range"]')[0].id = "rapi";
        jQuery(omitir).insertAfter(rapi);
        desactiveOP = function(){jQuery('input[type="radio"]:not([name="opResponse"])').each(function(){this.disabled = true;});};
        jQuery('input[type="radio"]:not([name="opResponse"])').each(function(){
            this.style.transform = "scale(2)";
            this.setAttribute("onclick","if(!this.disabled){" + this.getAttribute("onclick") + ";desactiveOP();" + "}");
        });
        ne = document.querySelector("#wave > wave");
        ne.style.overflowX="hidden";
        cvas = document.querySelector("#wave > wave > canvas");
        divLoad = document.createElement("div");
        divLoad.style.height = "128px";
        divLoad.style.opacity = "0.1";
        divLoad.style.backgroundColor = "red";
        divLoad.style.width = "0px";
        ne.appendChild(divLoad);
        resumen = document.createElement("a");
        document.getElementsByClassName("title")[0].innerHTML = document.getElementsByClassName("title")[0].innerHTML.replace("&nbsp;","").replace("\t","").replace("\n","");
        document.getElementsByClassName("title")[0].innerHTML = document.getElementsByClassName("title")[0].innerHTML.replace("&nbsp;","");
        resumen.href = "https://www.humanatic.com/pages/hcat_intro.cfm?hcat=" + getValue("cat").split("hcat=")[1];
        resumen.textContent = "Overview";
        resumen.target="_black";
        document.getElementsByClassName("title")[0].appendChild(resumen);
        if(typeof wavesurfer.Drawer.drawPeaks !== "undefined"){
            percen = document.createElement("span");
            percen.style.fontSize = "30px";
            percen.style.marginLeft = "10px";
            percen.style.marginLeft = "10px";
            $(percen).insertAfter($('.controls')[0]);
            wavesurfer.seekTo = function(progress){
                var paused = this.backend.isPaused();
                var oldScrollParent = this.params.scrollParent;
                if (paused) {
                    this.params.scrollParent = false;
                }
                this.backend.seekTo(progress * this.getDuration());
                this.drawer.progress(this.backend.getPlayedPercents());

                if (!paused) {
                    this.backend.play();
                }
                this.params.scrollParent = oldScrollParent;
                this.fireEvent('seek', progress);
            };
            wavesurfer.Drawer.drawPeaks = function(peaks, length) {
                if(typeof tod !== "undefined")clearTimeout(tod);
                this.resetScroll();
                this.setWidth(length);
                this.drawWave(peaks);
                if(peaks+"" !== "" && length !== 0){
                    try{
                        if(typeof fds !== 'undefined') try{clearTimeout(fds);}catch(e){}
                        fds = setTimeout(function(){
                            $(percen).hide(400,function(){percen.textContent="Listo";});$(percen).show(400);
                            setTimeout(function(){$(divLoad).animate({opacity: 0},2000,function(){divLoad.remove();});$(percen).hide(2000,function(){percen.remove();});},1000);
                            fds = true;
                        },2000);
                    }catch(e){}
                }
            };
            wavesurfer.onProgress = function (e) {
                if (e.lengthComputable) {
                    percentComplete = e.loaded / e.total;
                } else {
                    percentComplete = e.loaded / (e.loaded + 1000000);
                }
                this.fireEvent('loading', Math.round(percentComplete * 100), e.target);
                try{
                    if(typeof TOP === "undefined" && percentComplete != 1){
                        TOP = setTimeout(function(){
                            percen.textContent = "Cargando("+parseInt(percentComplete*100)+"%)...";
                            divLoad.style.width = (parseInt(percentComplete*100) * cvas.style.width.split("px")[0])/ 100 + "px";
                            $(percen).show('slow');
                            TOP = undefined;
                        },100);
                    } else if(percentComplete == 1){
                        $(percen).hide(400,function(){percen.textContent="!Audio Cargado!";});$(percen).show(400);
                        setTimeout(function(){
                            $(percen).hide(400,function(){percen.textContent="Construyendo Grafico...";});$(percen).show(400);
                        },1000);
                    }
                }catch(e){}
            };
            wavesurfer.Drawer.progress = function (progress) {
                var minPxDelta = 1 / this.params.pixelRatio;
                var pos = Math.round(progress * this.width) * minPxDelta;

                if (pos < this.lastPos || pos - this.lastPos >= minPxDelta) {
                    this.lastPos = pos;

                    if (this.params.scrollParent) {
                        var newPos = ~~(this.wrapper.scrollWidth * progress);
                        this.recenterOnPosition(newPos);
                    }

                    this.updateProgress(progress);
                }
                try{
                    if(typeof skipi_exe == 'undefined'){
                        declareFunctionsJump();
                        skipi();
                    }
                }catch(e){}
            };
        } else {console.log('Ha habido un problema con el reproductor de audio');}
    }
    getStim(true);
}

function declareFunctionsJump(){
    checkNull = function(){
        var cvas = document.querySelector("#wave > wave > canvas");
        data="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAACWCAYAAAD0QVlxAAAALElEQVQ4T2NkgALGUQYDw2ggAFMBUYHwvvn9flCKIUrxaNIaDShwGhiuqQUAGzIDtxF5ArkAAAAASUVORK5CYII=";
        ctx = cvas.getContext('2d');
        var img = ctx.getImageData($('wave > wave ')[0].offsetWidth,0,2,cvas.offsetHeight);
        var cv=document.createElement('canvas');
        var cv_ctx=cv.getContext('2d');
        cv_ctx.canvas.width = 2;
        cv.style.width = "2px;";
        cv.style.height = cvas.offsetHeight+"px";
        cv_ctx.putImageData(img,0,0);
        if(compare(cv.toDataURL(),data) > 70) return true;   else return false;
    };

    compare = function (s1,s2){
        var c=0;
        for(var i=0; i<s1.length;i++){
            if(s1[i]==s2[i]){
                c++;
            }
        }
        return ((c*100)/s1.length);
    };

    skipi = function(){
        if(typeof sk_f !== 'undefined') clearTimeout(sk_f);
        sk_f = setTimeout(function(){skipi_exe = false;},1000);
        skipi_exe = true;
        if(checkNull()){
            if(typeof fle1 !== "undefined"){
                if(fle1 === false){
                    if(typeof fds !== 'undefined'){
                        if(fds === true){
                            wavesurfer.skip(0.1);
                            skipi();
                        } else {
                            setTimeout(skipi,100);
                        }
                    } else {setTimeout(skipi,100);}
                } else {
                    setTimeout(skipi,100);
                }
            } else {
                if(typeof fds !== 'undefined'){
                    if(fds === true){
                        wavesurfer.skip(0.1);
                        skipi();
                    } else {setTimeout(skipi,100);}
                } else {setTimeout(skipi,100);}
            }
        } else {
            setTimeout(skipi,100);
        }
    };
}
if(location.href.indexOf("https://www.humanatic.com/pages/categorize_nada.cfm") != -1){
    setTimeout(function(){process = true;},30000);
    cm = document.getElementById("content_main");
    label = document.createElement('label');
    label.textContent = "Porfavor espera almenos 30 segundos para evitar una penalizacion de tiempo, puede volver a verificar en: ";
    sp = document.createElement('span');
    sp.textContent = "30";
    sp.id = "sp";
    label.appendChild(sp);
    cm.appendChild(label);
    sp.style.color = "red";
    setTimeout(TOCN,1000);
    document.getElementsByClassName('no')[0].id = "no";
    b = document.createElement('button');
    l = document.createElement('label');
    l.textContent = "Volver a las categorias automaticamente: ";
    c = document.createElement('center');
    c.appendChild(l);
    c.appendChild(b);
    no.appendChild(c);
    b.style.borderStyle = "solid";
    b.style.backgroundColor = "#0080ff";
    b.style.borderColor = b.style.backgroundColor;
    b.style.cursor = "pointer";
    ar = (getValue('autoreload') !== undefined) ? getValue('autoreload') : false;
    b.className = ar ? "e" : "a";
    b.textContent = (b.className == "e") ? "Encendido" : "Apagado";
    b.style.backgroundColor = (b.className == "e") ? "#0080ff" : "";
    b.style.borderColor = b.style.backgroundColor;
    b.onclick = function(){
        this.textContent = (this.className == "e") ? "Apagado" : "Encendido";
        this.className = (this.className == "e") ? "a" : "e";
        this.style.backgroundColor = (this.className == "e") ? "#0080ff" : "";
        this.style.borderColor = b.style.backgroundColor;
        no.focus();
        GM_setValue('autoreload',(this.className == "a") ? false: true);
        return false;
    };
    b.onfocus = function(){
        b.style.outline = "none";
    };
} else if(location.href.indexOf("https://www.humanatic.com/pages/categorize_slow_down.cfm?CFID=") != -1 || location.href.indexOf("https://www.humanatic.com/pages/multiple_calls.cfm?detect=s") != -1){
    location.href = "https://www.humanatic.com/pages/" + document.querySelector("meta[http-equiv='refresh']").content.split("URL=")[1];
} else if(location.href.indexOf("https://www.humanatic.com/pages/categorize_slow_down.cfm?rk=") != -1){
    location.href = getValue("cat");
}

function TOCN(){
    if(parseInt(sp.innerHTML) > 0){
        sp.innerHTML = parseInt(sp.innerHTML) - 1;
        setTimeout(TOCN,1000);
    }
}

function C(){
    ac = parseInt((parseInt(new Date().getTime()) - parseInt(getValue('recent'))) / 1000);
    if(ac < 60) ac = 60 - ac; else ac = 0;
    ee = document.getElementById("nav-one");e = ee.getElementsByTagName("a")[0];
    if(e.innerHTML.split("|").length <= 1) {e.innerHTML = e.innerHTML + " | " + ac;} else {
        e.innerHTML = e.innerHTML.split(" | ")[0] + " | " + ac;
    }
    if(getValue('autoreload') == true){;
                                       if(location.href.indexOf("https://www.humanatic.com/pages/categorize_nada.cfm") != -1){
                                           if(typeof process !== "undefined")
                                               if(ac <= 0) {
                                                   if(typeof koo === "undefined"){
                                                       koo = true;
                                                       setTimeout(function(){location.href = "https://www.humanatic.com/pages/review.cfm";},2000);
                                                   }
                                               }
                                       }
                                      }
    //if(ac != 0)
    if(typeof koo === "undefined")
        CCC = setTimeout(C,1000);
}

function getStim(v){
    jQuery.get('https://www.humanatic.com/pages/results.cfm',function(r){
        h = document.createElement('html');
        h.innerHTML = r;
        stim = h.getElementsByClassName('right1')[7].innerHTML;
        ee = document.getElementById("nav-one");e = ee.getElementsByTagName("a")[0];
        e.innerHTML = e.innerHTML + ": " + stim;
        if(v) setTimeout(C,1000);
    });
}


function CT(n){
    if(document.visibilityState != "visible") {
        if(typeof alta !== "undefined"){
            if(!alta) alert("!Una nueva llamada!");
        } else {
            alert("!Una nueva llamada!"); alta = true;
        }
    } else {alta = true;}
    au = document.getElementsByTagName('audio')[1];
    //console.log("time: " + n);
    ppo = document.getElementById('progress-output');
    l = parseInt(ppo.innerHTML.split('/')[0]);
    if(n > 0){
        wave.style.borderStyle = "solid";
        if(n >= 15) {wave.style.borderColor = "green"; wave.style.borderStyle = "solid";}else {wave.style.borderColor = "red";}
        setTimeout(function(){CT(n+1);},1000);
    } else {
        if(l == 0){
            if(au.error){
                if(au.error.code == 4){
                    if(ppo.innerHTML.split(" | ").length < 2){
                        ppo.innerHTML = ppo.innerHTML + ' | Error: el audio no existe "NO CARGARA"';
                        if(typeof percen != "undefined") $(percen).hide("100");
                    }
                    console.log("error");
                    setTimeout(function(){CT(1);},1000);
                }
            } else if(parseInt(au.duration) <= 6){
                setTimeout(function(){CT(1);},1000);
                kkk = {}; kkk.keyCode = parseInt('6'.charCodeAt());
                document.body.onkeypress(kkk);
            } else {
                setTimeout(function(){CT(n);},1000);
            }
        } else {
            setTimeout(function(){CT(2);},1000);
        }
    }
}

/////////////////////////////////////////////////////////////////
function menuList(){
    div1 = document.createElement("div");
    div2 = document.createElement("div");
    div2.style.display="none";
    div1.style.color = "white";
    div1.style.textAlign = "center";
    div1.style.borderWidth = "1px";
    div1.style.borderStyle = "solid";
    div1.textContent = "Lista de Categorias";
    div2.style.left = "25%";
    div2.style.width = "50%";
    div2.style.position = "absolute";
    div2.style.top="0px";
    document.body.appendChild(div1);
    document.body.appendChild(div2);
    div1.style.left = "46%";
    div1.style.position = "absolute";
    div1.style.top = "0px";
    div1.style.height = "25px";
    div1.style.width = "10%";
    div1.onclick = function(){
        div2.style.display = (div2.style.display==="")?"none":"";
    };
    getValue("catList").forEach(function(e){
        tmpA = document.createElement('a');
        tmpA.href = e[0];tmpA.textContent=e[1];
        tmpA.onclick = function(){setValue('cat',this.href);console.log(getValue('cat') + ":Este:" + this.href);};
        div2.appendChild(tmpA);
        div2.onmouseleave = function(){this.style.display="none";};
    });
    div2.style.textAlign="center";
    jQuery(div2.getElementsByTagName('a')).each(function(){
        this.style.display="block";
        this.style.borderStyle="solid";
        this.style.borderRadius="5px";
        this.style.width="";
        this.style.backgroundColor = "blue";
        this.style.color = "white";
        this.style.textDecoration="none";
        this.style.borderColor = "black";
        this.style.marginTop="2px";
        this.setAttribute("target","_top");
    });
    div2.style.top = "30px";
}
