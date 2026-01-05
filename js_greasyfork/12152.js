// ==UserScript==
// @name propocracy
// @version 2013.09.29
// @description Gives prop bombs on fitocracy. To use, go to any page on fitocracy, and press F9 on your keyboard. It will click all Give Props links and load more. Does not auto prop comments.
// @match https://www.fitocracy.com/*
// @namespace https://greasyfork.org/users/6489
// @downloadURL https://update.greasyfork.org/scripts/12152/propocracy.user.js
// @updateURL https://update.greasyfork.org/scripts/12152/propocracy.meta.js
// ==/UserScript==

    //var $today = new Date();
    //var $yesterday = new Date($today);
    //$yesterday.setDate($today.getDate() - 1);
    //alert(getFormattedDate($yesterday));
    
version = '2013.04.11'

var t = window.setInterval(checkProps, 5000)

div = document.createElement('div')
ds = div.style
ds.color = 'black'
ds.backgroundColor = 'white'

div.id = 'd1'
div.textContent = 'scanning for prop buttons'

//document.body.appendChild(div)
document.getElementById('home-feed-nav').appendChild(div)

var isProfile = document.location.toString().indexOf('profile') !== -1

function checkProps(){
	var p = document.getElementsByClassName('give_prop')
	if (p.length === 0){
		d1.textContent = 'No prop buttons found'
	}
	else {
	   d1.textContent = p.length + ' prop buttons.'
	   
    }
    window.addEventListener('keydown', k, true )
}

var t2, t3

function k(e){
	//if (e.keyCode !== 120) return

	window.clearInterval(t)

	d1.textContent = '0 props given; Press ESC to cancel'
	window.removeEventListener('keypress', k)
	window.addEventListener('keypress', checkEscape)
	if (!isProfile) {
	   t2 = window.setInterval(scroll, 1000);
	   t3 = window.setInterval(go, 4000);
	   
	   window.setTimeout(stop, 30000, 'auto stop after 30 secs');
	}
	else {
	   window.setTimeout(go, 6000);
	   window.setTimeout(stop, 9000, 'limit reached for profile page');
	}

}

function checkEscape(e){
    if (e.keyCode === 27)
        stop('Esc pressed');
}

function scroll(){
    window.scrollTo(0,document.body.scrollHeight);
}

function getFormattedDate(input) {
    var pattern = /(.*?)\/(.*?)\/(.*?)$/;
    var result = input.replace(pattern,function(match,p1,p2,p3){
        var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
        return (months[(p1-1)] + " " + p2 + ", " + p3);
    });
    alert(result);
}

function go(){
	var props = parseInt(d1.textContent);
	var c = document.getElementsByClassName('stream_item');
	while(c.length !== 0) {

        if (c[0].getElementsByClassName('action_time')[0].innerHTML === 'Today' || c[0].getElementsByClassName('action_time')[0].innerHTML === 'Oct 14, 2015' || c[0].getElementsByClassName('action_time')[0].innerHTML === 'Oct 13, 2015' || c[0].getElementsByClassName('action_time')[0].innerHTML === 'Oct 12, 2015' || c[0].getElementsByClassName('action_time')[0].innerHTML === 'Oct 11, 2015') {
		    var p = c[0].getElementsByClassName('give_prop');
    		if (p.length !== 0) {
			    var e = document.createEvent('HTMLEvents')
			    e.initEvent ('click', true, true)
			    p[0].dispatchEvent(e)
			    props++
			    d1.textContent = props + ' props given'
		    }
        }		
		c[0].parentNode.removeChild(c[0])
	}
	if (document.getElementsByClassName('empty-state').length !== 0)
	   stop('end of feed detected')
}


function stop(reason){
    window.clearInterval(t)
    window.clearInterval(t2)
    window.clearInterval(t3)
    window.removeEventListener('keypress', checkEscape)
    window.removeEventListener('keypress', k)    
    d1.textContent = 'stopped: ' + reason
}