// ==UserScript==
// @name         Mutinga! (Silenciar Usuarios)
// @version      1.6.1a
// @description  Ocultar post, shouts y comentarios de usuarios
// @author       master_ripper
// @match        http://www.taringa.net/*
// @match        https://www.taringa.net/*
// @grant        none
// @namespace https://greasyfork.org/users/89223
// @downloadURL https://update.greasyfork.org/scripts/25982/Mutinga%21%20%28Silenciar%20Usuarios%29.user.js
// @updateURL https://update.greasyfork.org/scripts/25982/Mutinga%21%20%28Silenciar%20Usuarios%29.meta.js
// ==/UserScript==

/* TODO
- Importar/Exportar lista
*/

(function() {
    function getmutedUsers() { 
        if (localStorage.mutedUsers === undefined) { 
            localStorage.setItem('mutedUsers', '[]');
            return []; 
        } 
        
        var dee = JSON.parse(localStorage.mutedUsers); 
        return dee; 
    } 
    
    function addUser(user) { 
        var dee = JSON.parse(localStorage.mutedUsers);
        //Check that the users isn't already muted 
        if (dee.indexOf(user)<0) { 
            dee.push(user); 
            console.log("Added User: ",user);
            localStorage.mutedUsers = JSON.stringify(dee);
        }
    }

    function searchUser(user) { 
        var dee = JSON.parse(localStorage.mutedUsers);
        //Check that the users isn't already muted 
        return (dee.indexOf(user)>=0);
    } 
    
    function delUser(user) {
        var dee = JSON.parse(localStorage.mutedUsers); 
        var indx = dee.indexOf(user); 
        
        //Check if user exist in list
        if (indx > -1) { 
            dee.splice(indx, 1);
            localStorage.mutedUsers = JSON.stringify(dee);
            console.log("Deleted User: ",user);
        } 
    } 
  

    function hidePosts(user){
        var selector = 'a[title="' + user + '"]'; 
        var usuario = document.querySelectorAll(selector); 
        for (i = 0; i < usuario.length; i++) { 
           usuario[i].parentNode.parentNode.style.display =  'none';
        } 
        
        var usuario2 = $('p:contains('+user+')');
        //console.log(usuario2);
        for (var i = usuario2.length - 1; i >= 0; i--) {
            usuario2[i].parentNode.parentNode.style.display= 'none';
        }
    }

    function hideShouts(user){
        var selector = 'a.hovercard.shout-user_name[href*="taringa.net/' + user + '"]';
        var usuario = document.querySelectorAll(selector);
        for (i = 0; i < usuario.length; i++) {
            var shout = usuario[i].parentNode.parentNode.parentNode.parentNode;
            shout.parentNode.removeChild(shout);
            //usuario[i].parentNode.parentNode.parentNode.parentNode.style.display = 'none';
        }

        //HomePage shouts
        var selector2 = 'a.shoutsb__user[href*="taringa.net/' + user + '"]';
        var usuario2 = document.querySelectorAll(selector2);
        for (i = 0; i < usuario2.length; i++) {
            usuario2[i].parentNode.style.display = 'none';
        }
    }
    
    function hideComments(user){
        var commentselector = 'div.comment-text a:not(.muted)[href*="/' + user + '"]';
        var comments = document.querySelectorAll(commentselector);
        //console.log("Comments: ",comments);
        for (i = 0; i < comments.length; i++) { 
            $(comments[i]).addClass('muted');
            var com = comments[i].parentNode;
            while(!com.classList.contains('comment')){
                com = com.parentNode;
            }
            if (com.parentNode.classList.contains('comment-replies-container')) {
                com = com.parentNode;
            }
            console.log("com= ",com);
            //com.style.display =  'none';
            com.parentNode.removeChild(com);
        }
    }

    function hideContent(){
        var userslist = getmutedUsers();  
        userslist.forEach(function  (user){
            if (window.location.pathname.indexOf('/mi')>-1 || window.location.pathname.indexOf('/shouts')>-1) {
                hideShouts(user);
            }
            if (window.location.pathname.length === 1 || window.location.pathname.indexOf('/posts/recientes')>-1 || window.location.pathname.indexOf('/posts/ascenso')>-1){ //Hide posts on home page
                hidePosts(user);
                hideShouts(user);
            }
            else{
                hideComments(user);
            }
        });
    }

    var list_elements = `<div class="list-element" style="height:25px;">
        <div class="container">
            <div style="float:left;width: 10%;box-sizing:border-box;">
                <img src="%avatarurl%" class="avatar-32" style="height: 26px;width: 26px;margin: -2px 0 -6px -7px;display: inline-block;">
            </div>
            <div style="float:left;width: 55%;box-sizing:border-box;">
                <div style="padding-top: 3px;"><a href="/%username%" style="color:#ddd;">%username%</a></div>
            </div>
            <div style="float:left; width:35%; box-sizing:border-box;">
                <div style="padding-top: 3px;cursor:pointer;" class="value delUser" data-users="%username%">Desbloquear</div>
            </div>
            <div style="clear:both;"></div>
        </div>
    </div>`;

    function showList(){
        var modalbackground = `<div id="mysimplemodaloverlay" class="simplemodal-overlay" style="opacity: 0.75; position: fixed; left: 0px; top: 0px; z-index: 1001; background-color: #000;"></div>`;
        $('body').append(modalbackground);
        $('#mysimplemodaloverlay').css({ width: window.innerWidth, height: window.innerHeight });

        var modalcontainer = `<div class="simplemodalcontainer" id="mysimplemodalcontainer" style="position: fixed; z-index: 1002; max-height: 360px; width: 360px; background-color: rgb(238, 238, 238); border-width: 4px; border-style: solid; border-color: rgb(68, 68, 68); border-image: initial; padding: 12px;">
            <a class="modalCloseImg simplemodal-close icon-cerrar" style="width: 25px;height: 29px;display: inline;z-index: 3200;position: absolute;top: -21px;right: -18px;cursor: pointer;font-size: x-large;color: rgb(255, 96, 96);" title="Cerrar"></a>
            <div class="simplemodal-wrap" style="height: 100%; outline: 0px; width: 100%; overflow-x: hidden; max-height: 328px;" tabindex="-1">
                <div class="list" style="overflow-x: hidden;"></div>
            </div>
            <div id="exp-imp-buttons" style="margin-top: 1px;">
                <a id="exp-btn" href="#" class="btn v fl-l">Exportar Lista</a>
                <a id="imp-btn" href="#" class="btn r fl-r">Importar Lista</a>
            </div>
            <div id="load-div" style="display: none;">
                <input type="file" id="file-input" style="width: 96%;" accept=".txt">
            </div>
        </div>`;

        $('body').append(modalcontainer);

        $('#mysimplemodalcontainer').css({ left: (window.innerWidth-392)/2, top: (window.innerHeight-360)/2 });

        $('body').on('click', '#mysimplemodalcontainer > a.modalCloseImg', function(event) {
            event.preventDefault();
            $('#mysimplemodalcontainer').remove();
            $('#mysimplemodaloverlay').remove();
        });

        //ExportList Button
        var exp_btn = document.querySelector('#exp-btn:not(.action-assigned)');
        if (exp_btn!==null) {
            exp_btn.addEventListener("click", function() {
                var fname = 'mutinga-backup_'+getTimeStamp()+'.txt';
                var cont = exporting();
                download(fname,cont);
                $(this).addClass('action-assigned');
            }); 
        }

        //ExportList Button
        var imp_btn = document.querySelector('#imp-btn:not(.action-assigned)');
        if (imp_btn!==null) {
            imp_btn.addEventListener("click", function() {
                var container = document.getElementById('mysimplemodalcontainer');
                container.style.maxHeight='400px';

                var load_div = document.getElementById('load-div');
                load_div.style.display='block';

                document.getElementById('file-input').addEventListener('change', readSingleFile);
                $(this).addClass('action-assigned');
            }); 
        }

        var userslist = getmutedUsers();
        var $list = $("#mysimplemodalcontainer > div > div.list");
        userslist.forEach(function (user){
            var list_el = list_elements.replace(/%username%/g, user);
            var avatarurl;
            $.get('https://api.taringa.net/user/nick/view/'+user,function(res,status){
                avatarurl=res.avatar.small;     
                //console.log("avatarurl inside: ",avatarurl);
                $list.append(list_el.replace(/%avatarurl%/g, avatarurl));
            });
            //console.log("avatarurl outside: ",avatarurl);
        });
        if (userslist.length==0) {
            var message = `<strong>No tienes usuarios muteados</strong>`;
            $list.css('text-align', 'center').append(message);
        };
    }


    function propagateButtons(){
        //Comments Buttons
        var buttonhide = `<li class="">
                    <a class="addUnlike mutebtn" username="%username%" title="Silenciar Usuario">
                        <i class="icon-no-ver"></i>
                    </a>
                </li>`;

        $('div.comment-text a:not(.comment-content a)').each(function() {
            var $a = $(this);
            var name = $a.text();
            var buttonhide_ = buttonhide.replace(/%username%/g,name);
            $a.closest('.comment').find('.comment-actions ul:not(.hasmutebtn)').append(buttonhide_).addClass('hasmutebtn');
        });

        //Shout Buttons
        var muteatshout = `<li><div class="icon-no-ver shout-action shout-mutebtn" username="%username%">Silenciar</div></li>`;

        $('a.hovercard.shout-user_name').each(function() {
            var $a = $(this);
            var name = $a.text();
            var muteatshout_ = muteatshout.replace(/%username%/g,name);
            $a.closest('.shout-heading').find('ul.shouts_actions:not(.hasmutebtn)').append(muteatshout_).addClass('hasmutebtn');
        });

        //Profile Buttons
        if (document.body.classList.contains('section-perfil')) {
            var logged_user = $('span.user-name').text().trim();
            var username = window.location.pathname.substr(1).split("/")[0];
            
            if(logged_user != username){ 
                //Other Profile
                var buttonAddUser = `<a title="Silenciar" class="btn g muteprofile" username="%username%" style="display:none;">
                            <div class="btn-text follow-text">
                                Silenciar
                            </div>
                        </a>`;
                var buttonMutedUser = `<a title="Quitar de la lista negra" class="btn r unmuteprofile" username="%username%" style="display:none;">
                            <div class="btn-text follow-text">
                                Silenciado
                            </div>
                        </a>`;
                $('div.follow-buttons').first().after(buttonMutedUser.replace(/%username%/g,username), buttonAddUser.replace(/%username%/g,username));
                
                if (searchUser(username)) { //Search user in db
                    //Blocked User
                    $('a.unmuteprofile').css('display', 'inline-block');
                }
                else{
                    //Not Blocked User
                    $('a.muteprofile').css('display', 'inline-block');
                }
            }
            else{
                //Own profile
                var buttonShowList = `<a title="Ver Lista de Usuarios Silenciados" class="btn g showlistbtn">
                            <div class="btn-text follow-text">
                                Usuarios Silenciados
                            </div>
                        </a>`;
                $('a.btn[href="/cuenta"]').after(buttonShowList);
            }
        }
    }
    
    function vanishComment(comm){
        comm[0].style= 'transition : opacity 0.5s linear; opacity : 0';
    }

    function exporting(){
        var dee = JSON.parse(localStorage.mutedUsers);
        var content='';
        dee.forEach(function(u){
            content += u+'/';
        });
        content = content.substring(0,content.length-1); //remove last '/'
        //console.log(content);
        //download('mutinga-backup.txt',content); 
        return content;
    }

    function download(filename, text) {
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
      element.setAttribute('download', filename);

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
    }

    function readSingleFile(e) {
      var file = e.target.files[0];
      if (!file) {
        return;
      }
      var reader = new FileReader();
      reader.onload = function(e) {
        var content = e.target.result;
        //import users
        importing(content);
        //close modal
        document.querySelector('a.modalCloseImg').click();
        //reopen modal
        showList();
      };
      reader.readAsText(file);
    }

    function importing(content){
        var users_to_import = content.split("/");
        var dee = JSON.parse(localStorage.mutedUsers);
        users_to_import.forEach(function(user){
            //Check that the users isn't already muted 
            if (dee.indexOf(user)<0) { 
                dee.push(user); 
                console.log("Added User: ",user);
            }
        });
        localStorage.mutedUsers = JSON.stringify(dee);
    }

    function getTimeStamp() {
        var d = new Date();
        var n = d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getUTCDate()+'-';
        n += d.getHours()+':'+d.getMinutes()+':'+d.getSeconds();
        return n;
    }

    function assignActions(){
        //Comments Buttons
        var mutebtns = document.querySelectorAll('a.mutebtn:not(.action-assigned)');
        for (var i = 0, len = mutebtns.length; i < len; i++) {
          mutebtns[i].addEventListener("click", function() {
            addUser(this.getAttribute("username"));
            $(this).addClass('action-assigned');
            vanishComment($(this).closest('.comment'));
            setTimeout(hideContent,750);
          });
        }

        //Shout Buttons
        var shoutmutebtns = document.querySelectorAll('div.shout-mutebtn:not(.action-assigned)');
        for (var i = 0, len = shoutmutebtns.length; i < len; i++) {
          shoutmutebtns[i].addEventListener("click", function() {
            addUser(this.getAttribute("username"));
            $(this).addClass('action-assigned');
            vanishComment($(this).closest('.shout-item'));
            setTimeout(hideContent,500);
          });
        }

        if (document.body.classList.contains('section-perfil')) {
           
            var muteprofilebtn = document.querySelectorAll('a.muteprofile:not(.action-assigned)');
            for (var i = 0, len = muteprofilebtn.length; i < len; i++) {
              muteprofilebtn[i].addEventListener("click", function() {
                addUser(this.getAttribute("username"));
                $(this).addClass('action-assigned');
                $(this).css('display', 'none');
                $('a.unmuteprofile').css('display', 'inline-block');
              });
            }

            var unmuteprofilebtn = document.querySelectorAll('a.unmuteprofile:not(.action-assigned)');
            for (var i = 0, len = unmuteprofilebtn.length; i < len; i++) {
              unmuteprofilebtn[i].addEventListener("click", function() {
                delUser(this.getAttribute("username"));
                $(this).addClass('action-assigned');
                $(this).css('display', 'none');
                $('a.muteprofile').css('display', 'inline-block');
              });
            }

            var showlistbtn = document.querySelectorAll('a.showlistbtn:not(.action-assigned)');
            for (var i = 0, len = showlistbtn.length; i < len; i++) {
              showlistbtn[i].addEventListener("click", function() {
                showList();
                $(this).addClass('action-assigned');
              });
            }

            $("body").on("click", ".delUser", function(e){
                delUser($(this).data("users"));
                $(this).closest("div.list-element").remove();
            });

            
        }

    }

    function main() {
        propagateButtons();
        assignActions();

        hideContent();
        
    }

    $(document).ready(function(e) {
        main();
    });

    $(document).ajaxSuccess(function(event, jqXHR, settings) {
        if (settings.url.indexOf('/comments') > -1 || settings.url.indexOf('ajax/feed/fetch') > -1 || settings.url.indexOf('serv/more') > -1 ) {
            main();
        }
    });
    
})();