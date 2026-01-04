// ==UserScript==
// @name        JoyReactor easy dislike
// @description Haters gonna hate
// @namespace   http://joyreactor.cc
// @include     *://*joyreactor.cc/*
// @include     *://*.reactor.cc/*
// @version     0.6.9.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/31627/JoyReactor%20easy%20dislike.user.js
// @updateURL https://update.greasyfork.org/scripts/31627/JoyReactor%20easy%20dislike.meta.js
// ==/UserScript==

document.addEventListener( 'DOMContentLoaded', function()
{
	if( !checkWindow() )
		return;
	window.VOTE_Plus = false;
	window.post_container = [{}];
	start();
}, false );
function start()
{
	try{
		initPostContainer();
		infoPostContainer();
		removeAbyss();
		runCheck();
	}catch(error){
		console.error('[start] ', error);
	}
}
function checkWindow()
{
	if( window.parent !== window.self )
		return false;
	else if( window.location.href.search(/m\.joyreactor\.cc\/post\//) != -1 )
	{
		window.m_joyreactor = true;
		try{document.getElementById('post_navigation_forward').outerHTML = '';}
		catch(error){console.error('[onload] ', error);}
		return false;
	}
	else if( window.location.href.indexOf('/post/') != -1 )
		return false;
	return true;
}
function defaultVoteRules()
{
	return {
		plus:{
			tags:[],
			users:[]
		},
		minus:{
			tags:[],
			tags:[],
			users:[]
		},
		ignore:{
			tags:[],
			users:[]
		}
	};
}
function removeAbyss()
{
	if( window.location.href.indexOf('/user/') == -1 )
		return;
	post_container.forEach(function(item){item.remove_abyss();});
}
function runCheck()
{
	if( window.location.href.indexOf('/user/') == -1 )
		return;
	post_container.forEach(function(item){item.check();});
}
function post_rating_obj()
{
	this.elm = '';
	this.value = function(){ return this.elm.textContent.trim();};
	this.vote_plus = function(){ return this.elm.getElementsByClassName('vote-plus')[0]; };
	this.vote_minus = function(){ return this.elm.getElementsByClassName('vote-minus')[0]; };
	this.is_visible = function(){ return this.elm.innerHTML.trim() !== ''; };
	this.is_votable = function(){
		return this.elm.innerHTML.indexOf('vote-plus') != -1 || this.elm.innerHTML.indexOf('vote-minus') != -1;
	};
	this.vote = function(vote_act){
		try{return this.elm.getElementsByClassName(vote_act)[0].click();}
		catch(e){}
	};
	this.plus = function(){
		try{this.vote_plus().click();}
		catch(e){}
	};
	this.minus = function(){
		try{this.vote_minus().click();}
		catch(e){}
	};
}
function post_container_obj()
{
	this.id = '';
	this.author = '';
	this.taglist = [];
	this.rating = new post_rating_obj();
	this.plus = function(){this.rating.plus();};
	this.minus = function(){this.rating.minus();};
	this.vote = function(vote_act){this.rating.vote(vote_act);};
	this.vote_r = function(vote_rules){
		var stat = this.match(vote_rules);
		if( stat < 0 )
			this.vote('vote-minus');
		else if( stat > 0 )
			this.vote('vote-plus');
	};
	this.plus_r = function(vote_rules){
		if( this.match(vote_rules) > 0 )
			this.plus();
	};
	this.minus_r = function(vote_rules){
		if( this.match(vote_rules) < 0 )
			this.minus();
	};
	this.match_n = function(rule){
		return ( contain1(this.author, rule.users) ? 1 : 0 ) + ( contain2(this.taglist, rule.tags) ? 1 : 0 );
	};
	this.match = function(rules){
		return (this.match_n(rules.ignore) > 0 ? 0 : this.match_n( rules.plus ) - this.match_n( rules.minus ));
	};
	this.rating_visible = function(){ return this.rating.is_visible();};
	this.check = function()
	{
		if( this.rating_visible() )
			return;
		try{
			this.rating.elm.innerHTML = '<span><div class="vote-plus"></div> -- <div class="vote-minus"></div></span>';
			if( VOTE_Plus )
				this.plus();
			else
				this.minus();
		}catch(e){console.error('post_container_obj.check] ', e);}
	};
	this.remove_abyss = function()
	{
		try{this.rating.vote_plus().classList.remove('abyss');}
		catch(e){}
		try{this.rating.vote_minus().classList.remove('abyss');}
		catch(e){}
	};
}
function contain1( name, vec )
{
	return vec.some( function(item){return name === item;} );
}
function contain2( vec_lhs, vec_rhs )
{
	return vec_lhs.some( function(item){ return contain1(item, vec_rhs); } );
}
function initPostContainer()
{
	let post_list = document.getElementById('post_list');
	try{
		let elms = post_list.getElementsByClassName('postContainer');
		post_container.length = elms.length;
		for( let i = 0; i < elms.length; ++i )
			post_container[i] = new post_container_obj();
		post_container.forEach( function(item, i){
			item.id = elms[i].id.replace('postContainer', '');
			try{
				item.author = elms[i].getElementsByClassName('uhead_nick')[0].textContent.trim();
				item.taglist = elms[i].getElementsByClassName('taglist')[0].innerHTML.replace(/<[^>]+>/g, '').split('&nbsp;' +
					'').filter(function(it){return it.length > 0;}).map(function(it){return it.trim();});
				item.rating.elm = elms[i].getElementsByClassName('ufoot')[0].getElementsByClassName('post_rating')[0];
			}catch(err){}
		});
	}catch(e){
		console.error('[initPostContainer] ', e);
	}
}
function infoPostContainer()
{
	try{
		function m_joyreactor(){ return window.location.href.search(/m\.joyreactor\.cc/) != -1; }
		console.info('--------------');
		console.info('post_container.length = ', post_container.length);
		post_container.forEach( function(item, i){
			console.info('post_container[' + i + ']:');
			console.info('id         : ', item.id);
			if( m_joyreactor() && !item.author )
			{
				console.info('== CENSORED ==');
				console.info('--------------');
				return;
			}
			console.info('author     : ', item.author);
			console.info('taglist    : ', item.taglist.toString());
			console.info('rating     : ', item.rating.value());
			console.info('rating.html: ', item.rating.elm.outerHTML.trim());
			console.info('is_visible : ', item.rating.is_visible());
			console.info('is_votable : ', item.rating.is_votable());
			if( item.rating.is_votable() )
			{
				console.info('vote-minus : ', item.rating.vote_minus());
				console.info('vote-plus  : ', item.rating.vote_plus());
			}
			console.info('--------------');
		});
	}catch(e){
		console.error('[infoPostContainer] ', e);
	}
}
function runVotePlus()
{
	var v = function(i){post_container[i].plus();};
	runSuperSilentVote( v );
}
function runVotePlus_r( r )
{
	var v = function(i){post_container[i].plus_r(r);};
	runSuperSilentVote( v );
}
function runHate(){runVoteMinus();}
function runVoteMinus()
{
	var v = function(i){post_container[i].minus();};
	runSuperSilentVote( v );
}
function runVoteMinus_r( r )
{
	var v = function(i){post_container[i].minus_r(r);};
	runSuperSilentVote( v );
}
function runVote( a )
{
	var v = function(i){post_container[i].vote(a);};
	runSuperSilentVote( v );
}
function runVote_r( r )
{
	var v = function(i){post_container[i].vote_r(r);};
	runSuperSilentVote( v );
}
function runSuperSilentVote( v )
{
	let len = post_container.length;
	setTimeout( function(){v(0);},     0 + getRandom(300, 450) );
	setTimeout( function(){v(1);},  2500 + getRandom(100, 200) );
	setTimeout( function(){v(2);},  5000 + getRandom(150, 200) );
	setTimeout( function(){v(3);},  7500 + getRandom(120, 250) );
	setTimeout( function(){v(4);}, 10000 + getRandom(100, 400) );
	if( len < 6) return;
	setTimeout( function(){v(5);}, 12500 + getRandom(200, 500) );
	setTimeout( function(){v(6);}, 15000 + getRandom(100, 200) );
	setTimeout( function(){v(7);}, 17500 + getRandom(100, 200) );
	setTimeout( function(){v(8);}, 20000 + getRandom(100, 300) );
	setTimeout( function(){v(9);}, 22500 + getRandom(100, 300) );
}
function getRandom(min, max){return Math.floor( Math.random()*(max - min) + min );}