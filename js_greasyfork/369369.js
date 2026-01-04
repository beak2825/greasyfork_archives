// ==UserScript==
// @name        E-Hentai Load More Thumbnails
// @namespace   e-hentai.org
// @description On an e-hentai gallery page, click "Load more" next to the page numbers and enter how many pages' worth of additional thumbnails you want to load onto the current page.
// @match       *://*.exhentai.org/g/*
// @match       *://*.e-hentai.org/g/*
// @version     0.2.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/369369/E-Hentai%20Load%20More%20Thumbnails.user.js
// @updateURL https://update.greasyfork.org/scripts/369369/E-Hentai%20Load%20More%20Thumbnails.meta.js
// ==/UserScript==

console.log('Hi load more thumbs');

const MAX_PAGES = 20;
const START_PAGES = 0;
const DEFAULT_PAGES = 2;
var last_loaded = 0;
var base_url = '';

var container_div = document.querySelector('#gdt');
var c_div = document.querySelector('#gdt .c');
var top_row = document.querySelector('.ptt tr');
var bottom_row = document.querySelector('.ptb tr');
var new_td = document.createElement('td');
var a = document.createElement('a');
a.onclick = "return false";
a.innerHTML = 'Load more';
new_td.appendChild(a);
new_td.style.width = '72px';
new_td2 = new_td.cloneNode(true);
new_td.onclick = new_td2.onclick = pop_up;

top_row.appendChild(new_td);
bottom_row.appendChild(new_td2);

var m = document.location.href.match(/^([^?]+)(?:\??.*p=(\d+))?/);
if (m) {
	base_url = m[1];
	if (m[2]) {
		last_loaded = Math.max(last_loaded, m[2]);
	}
}

var page_links = Array.from(document.querySelectorAll('.ptt a'));
const last_page = Math.max.apply(null, page_links.map((el) => {
		var m = el.href && el.href.match(/p=(\d+)/);
		return parseInt(m && m[1]);
	})
	.filter((num) => num));

START_PAGES > 0 && start_load(START_PAGES);

function pop_up() {
	if (last_loaded >= last_page) {
		alert('No more pages to load');
		console.log('No more pages to load');
	} else {
		var desired_pages = parseInt(prompt('Load how many pages', localStorage.getItem('eh_desired_pages') || DEFAULT_PAGES));
		if (desired_pages > 0) {
			localStorage.setItem('eh_desired_pages', desired_pages);
			start_load(desired_pages);
		}
	}
}

function start_load(desired_pages) {
	if (last_loaded >= last_page) {
		console.log('No more pages to load');
		return;
	}
	var number_wanted = Math.min(desired_pages, MAX_PAGES);
	var end = Math.min(last_loaded + number_wanted, last_page);

	if (!document.querySelector('#marker' + (last_loaded + 1))) {
		add_marker(last_loaded + 1);
	}
	for (var i = last_loaded + 1; i <= end; i++) {
		var marker_div = add_marker(i + 1);
		var url = base_url + '?p=' + i;
		console.log('loading thumbs from', url)
		var oReq = new XMLHttpRequest();
		oReq.addEventListener('load', page_load(marker_div));
		oReq.open('GET', url);
		oReq.responseType = 'document';
		oReq.send();
		last_loaded = i;
	}
    adjust_page_links();
}

function add_marker(i) {
	var marker_div = document.createElement('div');
	marker_div.innerHTML = 'Page ' + i;
	marker_div.id = 'marker' + i;
	marker_div.style.clear = 'both';
	container_div.appendChild(marker_div);
	return marker_div;
}

function page_load(marker) {
	return function() {
		console.log(marker.id, 'response', this.response);
		const thumb_divs = Array.from(this.response.querySelectorAll('.gdtl, .gdtm, .gdts'));
		thumb_divs.forEach((el) => {
			container_div.insertBefore(el, marker);
		});
        increase_image_number(thumb_divs.length);
	}
}

function increase_image_number(num) {
    let image_count_p = document.querySelector('.gpc');
    image_count_p.textContent = image_count_p.textContent.replace(/Showing (\d+) - (\d+)/i, (m, p1, p2) => `Showing ${p1} - ${parseInt(p2) + num}`);
}

function adjust_page_links() {
    let current_page_tds = document.querySelectorAll('.ptds');
    let m = current_page_tds[0].textContent.trim().match(/(\d+)(?: - (\d+))?/);
    const current = parseInt(m && m[1]);
    const old_last_loaded = parseInt(m && m[2]) || current;
    for (let td of current_page_tds) {
        td.style.width = 'auto';
        td.style.padding = '0px 6px';
        let a = td.firstElementChild;
        a.textContent = `${current} - ${last_loaded + 1}`;
    }
    let gtbs = document.querySelectorAll('.gtb');
    for (let gtb of gtbs) {
        let tds = gtb.querySelectorAll('td');
        let prev_num = 0;
        let increment = last_loaded - old_last_loaded + 1;
        for (let td of tds) {
            let m = td.textContent.trim().match(/^\d+$/);
            let num = m && parseInt(m[0]);
            if (num > current && num < last_page + 1) {
                let new_num = num + increment;
                if (new_num < last_page + 1) {
                    let a = td.firstElementChild;
                    a.textContent = new_num;
                    a.href = a.href.replace(/\?p=\d+/, `?p=${new_num - 1}`);
                } else {
                    td.parentNode.removeChild(td);
                }
            } else if ( ( td.textContent.trim() === '...' 
                            && prev_num > current
                                && prev_num + increment >= last_page ) ||
                        ( num === last_page + 1
                            && last_loaded >= last_page ) ) {
                td.parentNode.removeChild(td);
            }
            prev_num = num;
        }
    }
}
