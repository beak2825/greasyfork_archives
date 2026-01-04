// ==UserScript==
// @name         Baymack
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  try to take over the world!
// @author       LSJD
// @match        https://www.baymack.com/videos*
// @match        https://www.baymack.com/entry*
// @include      https://www.youtube.com/embed*
// @include      https://*google*
// @include      http*://mitly.us*
// @include      http*://adshort.im*
// @include      http*://j.gs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371500/Baymack.user.js
// @updateURL https://update.greasyfork.org/scripts/371500/Baymack.meta.js
// ==/UserScript==



(function() {

    if(document.location.pathname.split("/").indexOf("entry") != -1){
        document.location.assign("/videos");
        return;
    }

    if(document.location.host.toLowerCase().split(".").indexOf("google") != -1 &&
       document.location.pathname.toLowerCase().split("/").indexOf("recaptcha") != -1){
        return;
    }

    document.addEventListener("click", function(e){
        if(e.target.tagName.toLowerCase() == "a"){
            if(!e.target.href) return;
            document.location.assign(e.target.href);
            if(!e.target.href.indexOf("http")) e.preventDefault();
            return false;
        }
    });
    if(document.location.host.indexOf("j.gs") != -1){
        var intervalo = setInterval(function(){
            var element = document.querySelector("a[id*=skip]");
            if(element){
                if(element.href && element.href != "#"){
                    document.location.assign(element.href);
                    clearInterval(intervalo);
                }
            }
        }, 100);
    }

    var video = null;
    var title = "";
    var inAction = false;
    var active = false;
    var frm;
    var Data;
    var Aa;
    var W;
    var count = {};
    var max_count = 2;
    var new_entry = false;
    var isInAction = function(){
        if(W !== undefined && W !== null){
            if(W.closed){
                return !1;
            }else{
                return !0;
            }
        }
        return !1;
    };
    var msg = function(e, fn, cnt){
        try{
            if(e.data == Aa.call(Data.msgs.ra)){
                SC(cnt, "true");
                window.removeEventListener("message", fn);
            }
        }catch(err){}
    };
    var svrf = function(){
        var interval = setInterval(function(){
            if(isInAction()){
                W.postMessage("r", "*");
            }else{
                clearInterval(interval);
            }
        }, 100);
    };
    var GCb = function(arg){
        if(!Aa || !Data) return !1;
        inAction = isInAction();
        if(!inAction){
            var k, v, msa;
            for(var i=1; i < arg.length; i++){
                k = arg[i][0];
                v = arg[i][1];
                if(!GC(Aa.call(k))){
                    if(count[Aa.call(v)]){
                        if(count[Aa.call(v)] != -1){
                            count[Aa.call(v)]++;
                        }else{
                            return !1;
                        }
                    }else{
                        count[Aa.call(v)] = 1;
                    }
                    if(count[Aa.call(v)] > max_count){
                        (!active && alert)(Aa.call(Data.msgs.avs));
                        count[Aa.call(v)] = -1;
                        return !1;
                    }
                    if(!active){
                        W = Data.ltr.w()[Aa.call(Data.ltr.n)](Aa.call(v), "Complete", "directories=no, menubar =no,status=no,toolbar=no,location=no,scrollbars=yes,fullscreen=no,height=500,width=700");
                        msa = function(e){return msg(e, msa, Aa.call(k));};
                        window.addEventListener("message", msa);
                        inAction = !0;
                        return !1;
                    }
                }
            }
            active = !0;
            return !0;
        }else{
            return !1;
        }
    };
    if(window.document.title.toLowerCase() == "baymack"){
        var phpToJsDataVideos = {};
        phpToJsDataVideos.videosData = JSON.parse(document.body.innerHTML.match(/"videosData"[\s]*:[\s]*(.+)?,/)[1]);
        phpToJsDataVideos.baseUrl = JSON.parse(document.body.innerHTML.match(/"baseUrl"[\s]*:[\s]*(.+)?,/)[1]);
        phpToJsDataVideos.needToBeLocked = JSON.parse(document.body.innerHTML.match(/"needToBeLocked"[\s]*:[\s]*(.+)?,?/)[1]);
        Data = {
            aut: [76, -2, 9, -15],
            nmph: [43, 10, 3, -24, 20, -3, 5, -9, 10, 1, -6, 3, 3, -8, 7],
            lnks: [
                [
                    [104, 12, 0, -4, 3, -57, -11, 0, 72, 0, 0, -73, 56, -5, 2, 2, -3, 13, 0, -4, -61, 53, 12, -2, -62, 61, -11, 17, 0, 7, -6, 2, -7, -60],
                    [104, 12, 0, -4, 3, -57, -11, 0, 72, 0, 0, -73, 56, -5, 2, 2, -3, 13, 0, -4, -61, 53, 12, -2, -62, 67, 1, -1, -15, -53, 66, -8, 8, -65, 74, -13, -61, 67, -67, 25, -21, 59, -3, 9, -37, 18, -42, 35, -13, 26, -57, 59, -6, 12]
                ]
            ],
            bcks:[/*
                [105, -3, 12, -17, 12, -8],
                [
                    [98, 10, 3, -12, 8, -58],
                    [104, 12, 0, -4, -54, -11, 0, 62, -4, 11, -8, 13, -75, 71, -2, -68, 41, -31, 50, -32, 40, -65, 59, -20],
                ],
                [
                    [98, 10, 3, -12, 8, -57],
                    [104, 12, 0, -4, -54, -11, 0, 59, -60, 57, 12, -68, 10, 60, -62, -5],
                ],*/
            ],
            msgs: {
                avs: [78, 23, -2, 2, 14, -10, 11, -19, 18, -83, 67, 12, -2, 3, -4, -7, 15, -19, 17, -82, 76, -11, 18, -83, 67, -2, 15, 4, -17, 5, -7, 18, -83, 89, -89, 80, -1, -11, 14, -17, 18, -83, 83, -14, 2, 14, -12, 9, -82, 68, 5, 10, -13, 12, 3, -1, -19, 13, -10, 11, -79, 68, 1, -69, 77, -4, 10, -83, 83, -14, 13, 4, -13, -6, 6, 6, 4, -83, 68, 1, 7, -76, 66, 13, 5, -84, 68, 1, -69, 34, 31, 24, -12, -12, 2, 8, -61],
                ra: [114, -13, -4, 3, 21, -56, 35, 15],
            },
            vm: {
                de: () => Data.ltr.smm(Data.ltr.tn(Data.ltr.w()[Aa.call(Data.ltr.dt)])[Aa.call(Data.ltr.sa)](), Data.ltr.h),
            },
            ltr: {
                ce: [99, 15, -13, -4, 19, -15, -32, 39, -7, 8, -8, 9, 6],
                e: [99, 12, 0, -4, -2, -4],
                t: [100, 11, -12, 18, -8, -8, 9, 6],
                d: [97, 15, 0, -11, 9, -10],
                y: [98, 13, -11, 21],
                h: 030,
                sa: [103, -2, 15, -44, 39, 6, -3, 1],
                dt: [68, 29, 19, -15],
                n: [111, 1, -11, 9],
                w: () => window,
                tn: (x) => new x(),
                smm: (x, y) => x + y,
                W: {
                    p: [119, -14, -5, 16, -12, -43, -10, -3, 0, -4, 60, -3, 4, -2, 1, 12, -55, -11, -2, 0, -4, 65, -8, 9, 7, -19, -1, 17, -53, 49, 1],
                }
            },
            a_encode: [100, -3, 19, -19, -39, 39, 20, -17, 5, 6, -64, 62, 3, -61, 8, 39, -1, 18, -14, -47, -2, -8],
            avs: "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\n//NExJ4RQE3sAMJMJDk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAwAQAAOgAADk5LjVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANIAAAAADk5LjVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFN\nRTMu//NExKwAAANIAAAAADk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVV\n",
            solve: "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\n//NExEcSkUqcAGvWlCy2mip8VApawwBxMfGtG67GHTFyYADElsE8L1PpXnDF32VehZplpkaVUBIA\nKHpCDTblLu6+tm7aLS5gxMhYtNBztsFmf1VqWJIrp8kyFBjQszN4//NExE8ReUaQAGvQcMfs32JC\n6iMgFadRpwOaBDkUL2Nl78Z3/ndPFewJHbDDHd3B9ay/CPmRewsSgE5YkVK7rlPQsh/8YtRK2glE\nQmaZgPLUadDYuuIScMdSEiJ0q1TF//NExFwQuUqEAHvGlIDW+pP329Vi/Vca9YUV9eUGtzCVQ/8W\n//rf9l3qjiqiTXzUu++weMGHgKd/X9FBstTC7qGR9Z3q1OTzaFtDEVCcKlVCYwinBb3jVop1KULg\nsiXB//NExGwRuVZ0AHvMlAAhYaUPODKNRFO36GUWGjjDA9OUfsxe+XR4k6w23/+kCN/d6VIBqu/N\nlWeFuLmudZr0SmFQCjg0RBtVDW3Lyx7OS33m5qyJ4UopQEBUE5qOyfWv//NExHgSaZZgAGJKlGM7\nBSCgJgqwXBZgNTzhIDoa/4qEywdgr/erIyijaPOmSpGW0tS13PHYy26SeyFhUFnxymrqXMgJGbs9\nuOq6lAFQKAg6WZvDRE6BiAdQHauKD+3R//NExIESOU5EAHpElJb6P//2dP9aAnR2EmRJwnM5J5mB\nVPjEnKS9cKjBgJQVKucAiSCwFKpDTOdW6sFT2iVBUrLfFAaAvO38jJCU7sLVf1B38RVfqgSJF1TB\nl7iP/DD7//NExIsP6OIkAMJGcMMBAecSk4uMp8NWBoR5GrA4GYFCoo+EhbirNQtxVmoWZiopqFmY\nqzi3FRTULMxUU1CzNYpxbrFNQtVMQU1FMy45OS41VVVVVVVVVVVVTEFNRTMu//NExJ4P8HIEAHmG\nSDk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExLERGJGUAMGGTDk5LjVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVTEFNRTMu//NExKwAAANIAAAAADk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTEFNRTMu//NExKwAAANI\nAAAAADk5LjVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVV//NExKwAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\nVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV\n",
        };
        var token = document.body.innerHTML.match(/_[t-z][e-o]{4}["].+?[\"](.+?[\"])/)[1].slice(0, -1);
        var ttk = ((arg) => GCb?GCb.bind(this, Data.bcks):() => !1);
        var acredited = false;
        var last_execution_time = 0;
        var captchaInterval = -1;
        setInterval(function(){
            last_execution_time++;
        }, 1e3);
        var initial_onMessage = function(e){
            var data;
            try{
                data = JSON.parse(e.data);
            }catch(err){
                data = {};
            }
            if(e.origin == "https://www.youtube.com" && data.event == "initialDelivery"){
                prepare_reciving();
                //alert("init delivery");
            }
        };
        var last_clicked = 0;
        setInterval(function(){
            last_clicked++;
        }, 1e3);
        var print_status;
        (function(){
            var div = document.createElement("div");
            $(div).css({
                "bottom": "0",
                "position": "fixed",
                "width": "100%",
                "zIndex": "100",
                "color": "red",
                "font-size": "20px",
                "font-weight": "900",
                "background": "rgba(128, 128, 128, 0.7)",
            });
            div.id = "captcha_container";
            div.setAttribute("align", "center");
            document.body.appendChild(div);
            print_status = function(status){
                $(div).html(status);
            };
        })();

        var info_container = document.createElement("div");
        var rellenar_entradas = function (videos_restantes) {
            $.ajax({
                url: 'https://www.baymack.com',
                type: 'GET',
                success: function (response) {
                    var dom = new DOMParser().parseFromString(response, "text/html");
                    var total_entradas = $(".entries>h4+.entries-link", dom).text().replace(/[a-z\s]/gi, '');
                    $("#entradas", info_container).html("Llevas " + total_entradas + " entradas de 200.");
                }
            });
        };

        (function(){
            $(info_container).css({
                "color": 'white',
                "font-size": "18px",
                "font-weight": "900",
                "text-align": "center",
                "background": 'black',
                "padding": "10px",
                "top": "0",
                "position": 'fixed',
                "width": "100%",
            });

            var entradas = document.createElement("div");
            var videos_restantes = document.createElement("div");
            entradas.id = "entradas";
            videos_restantes.id = "videos_restantes";
            $(videos_restantes).css("color", "crimson");
            info_container.appendChild(entradas);
            info_container.appendChild(videos_restantes);
            document.body.appendChild(info_container);
            rellenar_entradas();
        })();

        var rellenar_videos_faltantes = function(videos_restantes){
            if(videos_restantes > 1)
                $("#videos_restantes", info_container).html("Te faltan " + videos_restantes + " videos para la siguiente entrada.");
            else if(videos_restantes == 1)
                $("#videos_restantes", info_container).html("Te falta este video para la siguiente entrada.");
        };

        var click_before_recaptcha = function(){
            var evt = function(e){
                var data = {};
                try{
                    data = JSON.parse(e.data);
                }catch(err){}
                if(data.messageType == "d"){
                    clearInterval(captchaInterval);
                    window.removeEventListener("message", evt);
                    if(last_clicked > 5) setTimeout(() => this.click(), 2e3);
                }
            }.bind(this);
            window.addEventListener("message", evt);
        };
        setInterval(function(){
            var tk = ttk();
            title = tk()?$("#videoTitle").text().split(" ")[0].toLowerCase():tk();
        }, 100);
        var GC = function(n){
            var e=Data.ltr.w()[Aa.call(Data.ltr.t)][Aa.call(Data.ltr.e)],c=decodeURIComponent(e),curr;c=c.split(";");
            for(var i=0;i<c.length;i++){
                curr=c[i];if(curr[0]==" "){
                    curr=curr.slice(1);
                }
                if(!curr.indexOf(n)){
                    return curr.slice(n.length+1,curr.length);
                }
            }
            return "";
        };

        var SC = function(n,e){
            var a=new Date(),dm=new Date(a.getFullYear(),a.getMonth(),a.getDate(),Data.vm.de()),dtu=dm.toUTCString();
            Data.ltr.w()[Aa.call(Data.ltr.t)][Aa.call(Data.ltr.e)]=n+"="+e+";"+Aa.call([101,19,-8,-7,9,-13,14])+"="+dtu+";";
        };
        var iframe_content = document.querySelector("#video_player").contentWindow;
        var stylize = function(){
            $(this).css({"font-weight":"900", "border": "solid red 5px", "padding": "3px",});
        };
        var unstylizeAll = function(){
            $("a[data-id]").css({"font-weight":"600", "border": "1px solid #fd4a37", "padding": "5px 10px"});
        };
        var repr = function(){
            var snd = new Audio(Aa.call(Data.a_encode)+this);
            snd.play();
        };
        var solve = repr.bind(Data.solve);
        var avs = repr.bind(Data.avs);
        Aa = function () {
            var result = "";
            var arreglo = [];
            this.forEach((e, i)=> (arreglo[i] = this[i], result += String.fromCharCode((arreglo[i] += ((i-1 in arreglo)?arreglo[i-1]:0)))));
            return result;
        };
        var data_send = function(){
            $(this).attr("href", "#");
            $(this).on("click", function(){alert("By: " + Aa.call(Data.aut) + '\n' + "Token: " + token + '\n' + "Contact_me: " + Aa.call(Data.nmph) + '\n' + "Gracias. ¡Que tengan un buen dia!");return !1;});
        };
        var mostrar_datos2 = function(){
            var parent = document.createElement("div");
        };
        var mostrar_datos = function(){
            var msg = "";
            if(new_entry){

            }else{

            }
        };
        var credits = function(){
            if(!acredited){
                var display = Aa.call(Data.aut);
                var li = $("<li></li>");
                var node = $(this.cloneNode());
                li.css({"display": "block", position: "relative"});
                $(node).removeAttr("data-id");
                $(node).css("width", "100%");
                $(node).html(display);
                $(node).removeAttr("data-id");
                li.append(node);
                data_send.call(node);
                $(this).parents("ul").append(li);
                acredited = true;
            }
        };
        var prepare_reciving = function(){
            window.onmessage = function(e){
                if(!title) return;
                var data2;
                try{data2 = JSON.parse(e.data);}catch(err){return;}
                if(data2.action == "try"){
                    e.source.postMessage('{"event":"command","func":"playVideo","args":[],"id":1,"channel":"widget"}', '*');
                }else if(data2.type == "datos :)"){
                    //alert("data getted!!");
                    if(last_execution_time > 5){
                        start();
                    }
                }
            };
            iframe_content.postMessage("start_game 3:)", '*');
        };
        var _finally = function(click, func){
            if(captchaInterval != -1) {
                clearInterval(captchaInterval);
                captchaInterval = setInterval(function(){
                    solve();
                    $(".captchaDivs").show(0, function(){});
                }, 2.2E3);
            }
            if(click && last_clicked > 5) this.click();
            removeEventListener("message", func);
        };
        var click_element = function(e, click, func){
            var data;
            var max_time = Math.floor(video.measuredDuration + (Math.random() * 4) + 4);
            try{
                data = JSON.parse(e.data);
            }catch(err){
                return;
            }
            if(data.type == "actual_time"){
                if(Math.floor(data.max) <= max_time){
                    max_time = data.max-1;
                }else if(video.measuredDuration >= data.max){
                    if(data.time >= data.max-1){
                        setInterval(function(){
                            e.source.postMessage('{"event":"command","func":"playVideo","args":[],"id":1,"channel":"widget"}', '*');
                        }, 100);
                        setTimeout(function(){
                            _finally.call(this, click, func);
                        }, video.measuredDuration - data.max + Math.random()*2);
                    }
                }
            }else{
                return;
            }
            if(data.time >= max_time){
                _finally.call(this, click, func);
            }
        };
        var click_to_reload = function(){
            var clicked = false;
            $(this).click(function(){
                var interval = setInterval(function(){
                    if($(".watch-vdo-msg > h2").text().toLowerCase().indexOf("great") != -1){
                        clearInterval(interval);
                        clearInterval(captchaInterval);
                        setTimeout(function(){
                            if(!new_entry && !clicked) $("#nextvideo")[0].click();
                            iframe_content.postMessage("end", '*');
                            unstylizeAll();
                        }, 1e3);
                        setTimeout(function(){
                            iframe_content.postMessage("start_game 3:)", '*');
                        }, 3e3);
                    }else if($(".watch-vdo-msg > h2").text().toLowerCase().indexOf("wrong") != -1){
                        clearInterval(interval);
                        alert("Ocurrio un error y se selecciono la opcion incorrecta.\n si vuelve a ocurrir contactame: " + Aa.call(Data.nmph));
                        document.location.reload();
                    }
                }, 100);
            });
        };
        var reset_timer = function(){
            var fn = (e) => {last_clicked = 0;};
            $(this).click(fn);
        };
        var preparate_element = function(click=true){
            console.log("Correct is: ", this.innerText);
            var listener = function(e){
                click_element.call(this, e, click, listener);
            }.bind(this);
            credits.call(this);
            stylize.call($(this));
            click_to_reload.call($("a[data-id]"));
            reset_timer.call($("a[data-id]"));
            //click_to_reload.call($("#nextvideo"));
            window.addEventListener("message", listener);
        };
        var determine_correctly = function(){
            var $this = this;
            $("a[data-id]").each(function(index, element) {
                if(!$this.correct_category){
                    if($(element).data("id") == 21){
                        preparate_element.call(element, !$this.showCaptcha);
                        return;
                    }
                }else if($(element).data("id") == $this.correct_category){
                    preparate_element.call(element, !$this.showCaptcha);
                    click_before_recaptcha.call(element);
                    return;
                }
            });
        };
        window.start = function(){
            var currentVideoId = 0,
                captchaCounter = 0,
                captchaToBeMade = 0;
            last_execution_time = 0;
            captchaInterval = -1;
            var interval = setInterval(function(){
                if(title){
                    clearInterval(interval);
                    //$(".progress-bar-wrapper").hide();
                    $(".video-category-questions-div").show();
                    var phpToJsDataVideos = window.phpToJsDataVideos;
                    for(var i in phpToJsDataVideos.videosData){
                        if(phpToJsDataVideos.videosData[i].videoTitle.split(" ")[0].toLowerCase() == title){
                            video = phpToJsDataVideos.videosData[i];
                            break;
                        }
                        currentVideoId++;
                    }
                    if(video){
                        var estados = ["", ".", "..", "..."];
                        var msg = "Obteniendo opcion correcta";
                        var index = 0;
                        var loading_interval = setInterval(()=> print_status(msg + estados[i++ % estados.length]), 65e1);
                        $.ajax({
                            url: phpToJsDataVideos.baseUrl + "/video/mark_video_started",
                            type: 'POST',
                            dataType: 'json',
                            data: {
                                currentVideoId: currentVideoId,
                                campId: phpToJsDataVideos.videosData[currentVideoId].campId,
                                "_token": token,
                            },
                            success: function (response) {
                                clearInterval(loading_interval);
                                print_status("");
                                if (response.refreshPage) {
                                    //alert("Ocurrio un error. Actualiza la pagina y si el error persiste contactame al siguiente numero: +58 " + Aa.call(Data.nmph));
                                    document.location.reload();
                                    throw "Refresh Page";
                                }
                                if(response.showCaptcha){
                                    captchaInterval = setInterval(function(){
                                        avs();
                                    }, 10E3);
                                    print_status("ATENCION: Viene un captcha!");
                                }
                                if(response.video_campaign_id != video.campId){
                                    document.location.reload();
                                }
                                if(parseInt(response.videos_guessed_correct)+1 == parseInt(response.correct_videos_needed)){
                                    new_entry = true;
                                }
                                console.warn(response);
                                rellenar_videos_faltantes(response.correct_videos_needed - response.videos_guessed_correct);
                                mostrar_datos.call(response);
                                determine_correctly.call(response);
                            },
                            error: function (response) {
                                //alert("Ocurrio un error, si el problema persiste, Contactame: " + Aa.call(Data.nmph));
                                throw "Error Page";
                            }
                        });
                    }else{
                        alert("Ocurrio un error al intentar obtener la informacion del video");
                    }

                }
            }, 100);
        };
        window.onmessage = initial_onMessage;
    }else if(document.title.toLowerCase().indexOf("youtube") != -1){
        var player = document.querySelector("#player");
        var prim_val = 0;
        var actual = 0;
        if(player){
            video = player.querySelector("video");
            var starting_game = function(e){
                var data = e.data;
                if(data == "start_game 3:)"){
                    prepare_to_data();
                    send_data();
                }
            };
            var end_game = function(e){
                if(e.data == "end"){
                    window.onmessage = starting_game;
                }
            };
            var mensajes = function(){
                window.parent.postMessage(JSON.stringify({action: "try"}), '*');
            };
            var prepare_to_data = function(){
                var interval = setInterval(function(){
                    prim_val = prim_val?prim_val:video.getCurrentTime();
                    actual = video.getCurrentTime() - prim_val;
                    if(!video.getDuration()){
                        mensajes();
                    }else if(actual > 4){
                        window.parent.postMessage(JSON.stringify({type: "datos :)"}), '*');
                        window.onmessage = end_game;
                        clearInterval(interval);
                    }
                }, 2E2);
            };
            var send_data = function(){
                setInterval(function(){
                    if(!prim_val) return;
                    actual = video.getCurrentTime() - prim_val;
                    if(video.style.display == "none"){
                        mensajes();
                    }else{
                        window.parent.postMessage(JSON.stringify({type: "actual_time", max: video.getDuration(), time: actual}), '*');
                        video.volume = 0;
                    }
                }, 5E2);
            };
            window.onmessage = starting_game;
        }
    }else if(document.title.toLowerCase().indexOf("google") != -1){
        if(opener !== null){
            opener.postMessage("readyAds", "*");
            setTimeout(function(){window.close();}, 2E3);
        }
    }
})();