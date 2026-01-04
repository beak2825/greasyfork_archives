// ==UserScript==

// @namespace jmdz
// @name     [deprecated] insis coop
// @description cosas parapidas para insis coop
// @version  1.10.1
// @grant    unsafeWindow
// @run-at document-end

// @include http://200.123.216.131/cirrus/*
// @include http://200.123.216.131:8888/cirrus_paralelo/*
// @include http://192.168.51.8/cirrus/*
// @include http://192.168.51.249/cirrus_paralelo/*
// @include http://localhost/cirrus/*

// @downloadURL https://update.greasyfork.org/scripts/40695/%5Bdeprecated%5D%20insis%20coop.user.js
// @updateURL https://update.greasyfork.org/scripts/40695/%5Bdeprecated%5D%20insis%20coop.meta.js
// ==/UserScript==

if(typeof(unsafeWindow.$)==='function'){

	var $=unsafeWindow.$;

	var m=$('ul.nav.sidebar-nav li.dropdown:last-child');

    if(m.length){

        console.log(GM_info.script.name+' v'+GM_info.script.version);

        m.after(m.clone(true));
        m=$('ul.nav.sidebar-nav li.dropdown:last-child');

        var t=m.find('a.dropdown-toggle').first();
        t.html(GM_info.script.name+' <b class="caret"></b>');

        var l=m.find('ul');
        l.html('');

        var p=location.pathname.split('/')[1];

        //enlaces dentro del entorno
        l.append('<li><a href="/'+p+'/z">Z</a></li>');
        l.append('<li><a href="/'+p+'/docs">Docs</a></li>');
        l.append('<li><a href="/'+p+'/stock/configurar_tipos_de_movimientos">Stk / Cnf Tip Mov</a></li>');
        l.append('<li><a href="/'+p+'/administracion/mostrar_modos_cuenta">Adm / Mod Cta</a></li>');

        //enlaces a entornos
        l.append('<li><a href="http://192.168.51.8/cirrus">prod</a></li>');
        l.append('<li><a href="http://192.168.51.249/cirrus_paralelo">test</a></li>');
        l.append('<li><a href="http://localhost/cirrus">desa</a></li>');
        l.append('<li><a href="http://192.168.51.8/phpmyadmin/server_status_processes.php">ddbb prod status</a></li>');
        l.append('<li><a href="http://192.168.51.8/phpmyadmin/db_sql.php?server=1&db=cooperativa">ddbb prod</a></li>');
        l.append('<li><a href="http://192.168.51.249/phpmyadmin/db_sql.php?server=1&db=cooperativa_paralelo">ddbb test</a></li>');
        l.append('<li><a href="http://localhost/phpmyadmin/db_sql.php?server=1&db=cooperativa">ddbb desa</a></li>');

        //no cerrar con boton medio
        var entradas=$('ul.nav.sidebar-nav>li.dropdown>ul.dropdown-menu>li>a:not([href="#"])');
        entradas.mousedown(function(ev){
            if(ev.button==1){
                ev.target.sidebar_wrapper__scrollTop=$('#sidebar-wrapper').prop('scrollTop');
            }
        });
        entradas.mouseup(function(ev){
            if(ev.button==1){
                setTimeout(function(){
                    $(ev.target).parent().parent().prev().click();
                    $('#sidebar-wrapper').prop('scrollTop',ev.target.sidebar_wrapper__scrollTop);
                },15);
            }
        });

        //mostrar id
        $('<a href="#">mostrar id</a>').appendTo($('<li></li>').appendTo(l)).click(function(ev){
            ev.preventDefault();
            var r=$('[type=radio]');
            if(r.length){
                var d=$('[type=radio]+div.mostrar-id');
                if(d.length){
                    d.remove();
                }
                else{
                    r.each(function(i,e){$(e).after('<div class="mostrar-id">'+e.value+'</div>')});
                }
            }
            else{
                alert('esta pantalla no tiene radios , ¿seguro que es un listado?');
            }
            $('#page-content-wrapper>button.hamburger').click();
        });

        $('<a href="#">langosta</a>').appendTo($('<li></li>').appendTo(l)).click(function(ev){
            ev.preventDefault();

            var b=+prompt('bicho? (0=listado)',0);
            if(b){
                open('http://192.168.51.8/bug/view.php?id='+b);
            }
            else{
                open('http://192.168.51.8/bug/view_all_bug_page.php');
            }

            $('#page-content-wrapper>button.hamburger').click();
        });

        //debug_toggle
        $('<a href="#">debug_toggle</a>').appendTo($('<li></li>').appendTo(l)).click(function(ev){
            ev.preventDefault();
            if(typeof(debug_toggle)==='function'){
                debug_toggle();
            }
            else{
                alert('debug_toggle no esta activa en esta pantalla');
            }
            $('#page-content-wrapper>button.hamburger').click();
        });

        //que la hamburgesa cierre los menus internos
        $('#page-content-wrapper>button.hamburger').click(function(){
            $('ul.nav.sidebar-nav li.dropdown.open a.dropdown-toggle').click();
        });

        //que el overlay blanco cierre el menu
        $('.overlay').click(function(){$('.hamburger').click();});

    }

}