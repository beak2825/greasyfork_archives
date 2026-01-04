// ==UserScript==
// @name         muahahaha anidb
// @namespace    muahahaha
// @version      1.5.0
// @description  easy copy for main title, url, schedule's url, song's names and song's creators. too fake tabs in top panel to cast, songs, rels and eps.
// @match        http://anidb.net/perl-bin/animedb.pl?show=anime&aid=*
// @match        https://anidb.net/perl-bin/animedb.pl?show=anime&aid=*
// @match        http://anidb.net/anime/*
// @match        https://anidb.net/anime/*
// @run-at       document-end
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/372669/muahahaha%20anidb.user.js
// @updateURL https://update.greasyfork.org/scripts/372669/muahahaha%20anidb.meta.js
// ==/UserScript==

(function() {

	function muahahaha_anidb(){
		if(typeof(unsafeWindow.$)==='function'){


			var $=unsafeWindow.$;

            // nombre
			var n=$('#tab_1_pane tr:first-child td.value [itemprop="name"]');
			n.after('<input style="width:'+n.css('width')+'" onclick="this.select()" value="'+n.text().replace(/"/g,'&quot;')+'"/>');
			n.css({display:'none'});

            // url
			var u=$('#tab_1_pane tr:first-child td.value a.shortlink');
			u.before('<input style="width:'+(7+u.text().length/2)+'em;" onclick="this.select()" value="'+u.attr('href')+'"/>');
			u.text('[\u2197]');

            // syoboi
			var s=$('#tab_1_pane a.i_resource_syoboi');
			s.before('<input style="width:5em;" onclick="this.select()" value="'+s.attr('href')+'"/>');

            // crunchyroll
			var c=$('#tab_1_pane a.i_resource_crunchyroll');
			c.before('<input style="width:5em;" onclick="this.select()" value="'+c.attr('href')+'"/>');

            // episodes
            $('.episodes').attr('id', 'episodes');
            $('.episodes h2.collapsed>span').click();

            // tabs
			$('#tabbed_pane .tabs')
				.append('<li title="" class=" tab fake"><a href="'+u.attr('href').replace('anidb.net/a','anidb.net/perl-bin/animedb.pl?show=rel&aid=')+'">RELS</a></li>')
				.append('<li title="" class=" tab fake" onclick="$(\'.tab.cast\').click();$(\'html,body\').animate({scrollTop:$(\'.tab.cast\').offset().top},2000);">CAST</li>')
				.append('<li title="" class=" tab fake" onclick="$(\'.tab.songs\').click();$(\'html,body\').animate({scrollTop:$(\'.tab.songs\').offset().top},2000);">SONGS</li>')
				.append('<li title="" class=" tab fake"><a href="#episodes">EPISODES</a></li>')
			;

            // interprete
			$('#songlist td.name.creator a').each(function($i,$e){
				var e=$($e);
				e.css({display:'inline',float:'left'});
				e.after('<input style="width:calc(100% - 5em);display:block;" onclick="this.select()" value="'+e.text().replace(/"/g,'&quot;')+'"/>')
				e.text('[\u2197]');
			});

            // cancion
			$('#songlist td.name.song a').each(function($i,$e){
				var e=$($e);
				e.css({display:'inline',float:'left'});
				e.after('<input style="width:calc(100% - 3em);display:block;" onclick="this.select()" value="'+e.text().replace(/"/g,'&quot;')+'"/>')
				e.text('[\u2197]');
			});

            // volver arriba
            let goUp=$('<a>\u21d1</a>')
                .appendTo('body')
                .css({
                    fontSize:'1.5em',
                    display:'inline-block',
               		display:'none',
                	cursor:'pointer',
             		zIndex:'1035',
               		position:'fixed',
                	bottom:'1em',
               		right:'1em',
                    fontWeight:'bolder',
                    background:'red',
                    width:'2em',
                    height:'2em',
                    lineHeight:'2em',
                    textAlign:'center',
                    borderRadius:'0.5em',
                })
                .on('click',function(){
                    $('html,body').animate({scrollTop:0},495);
                })
            ;
            $(window).on('scroll',function(){
                if(99<$(window).scrollTop()){
                    goUp.fadeIn(495);
                }
                else{
                    goUp.fadeOut(495);
                }
            });

		}
		else{

			setTimeout(muahahaha_anidb,100);

		}
	}

	muahahaha_anidb();

})();