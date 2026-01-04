// ==UserScript==
// @name Fix Invidious Channel View
// @description fetches '/playlist?list=ID' to get video list for channel.
// @namespace -
// @version 1.0.0
// @author NotYou
// @match *://invidious.snopyta.org/*
// @match *://yewtu.be/*
// @match *://invidious.kavin.rocks/*
// @match *://vid.puffyan.us/*
// @match *://invidious.namazso.eu/*
// @match *://inv.riverside.rocks/*
// @match *://youtube.076.ne.jp/*
// @match *://yt.artemislena.eu/*
// @match *://invidious.flokinet.to/*
// @match *://invidious.esmailelbob.xyz/*
// @match *://invidious.projectsegfau.lt/*
// @match *://inv.bp.projectsegfau.lt/*
// @match *://y.com.sb/*
// @match *://invidious.sethforprivacy.com/*
// @match *://invidious.tiekoetter.com/*
// @match *://invidious.nerdvpn.de/*
// @match *://inv.vern.cc/*
// @match *://invidious.slipfox.xyz/*
// @match *://inv.privacy.com.de/*
// @match *://invidious.rhyshl.live/*
// @match *://invidio.xamh.de/*
// @match *://invidious.dhusch.de/*
// @match *://inv.odyssey346.dev/*
// @match *://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion/*
// @match *://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion/*
// @match *://kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion/*
// @match *://grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion/*
// @match *://osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion/*
// @match *://u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion/*
// @match *://euxxcnhsynwmfidvhjf6uzptsmh4dipkmgdmcmxxuo7tunp3ad2jrwyd.onion/*
// @match *://invidious.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion/*
// @match *://inv.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion/*
// @match *://am74vkcrjp2d5v36lcdqgsj2m6x36tbrkhsruoegwfcizzabnfgf5zyd.onion/*
// @match *://ng27owmagn5amdm7l5s3rsqxwscl5ynppnis5dqcasogkyxcfqn7psid.onion/*
// @match *://verni6dr4qxjgjumnvesxerh5rvhv6oy5ddeibaqy5d7tgbiiyfa.b32.i2p/*
// @grant none
// @license GPL-3.0-or-later
// @icon data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/454687/Fix%20Invidious%20Channel%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/454687/Fix%20Invidious%20Channel%20View.meta.js
// ==/UserScript==

(location.pathname.indexOf('/channel/') !== -1 ? function() {
  let videoListQuery = '#contents > [class="pure-g"]:nth-last-child(3)'
	let videos = document.querySelector(videoListQuery)
  let next = 'nextElementSibling'
  let id = getId(location.href)

  if(videos) {
    let search = new URLSearchParams(location.search)
    let page = ''
    let _page = search.get('page')

    if(_page) {
      page = '&page=' + _page
    }

    fetch(location.origin + '/playlist?list=' + id + page)
      .then(response => response.text())
    	.then(content => {
      let _document = new DOMParser().parseFromString(content, 'text/html')
      let _videos = _document.querySelector(videoListQuery)
      let _next = _videos[next]
      let pagination = _next.querySelectorAll('a')

      for (let i = 0; i < pagination.length; i++) {
        let _p = pagination[i]
        let _id = getId(_p.href)

        _p.href = location.origin + '/channel/' + _id
      }

      videos.innerHTML = _videos.innerHTML
      videos[next].innerHTML = _next.innerHTML
    }).catch(e => console.error('Server Error', e))
  } else {
    console.error('Video List Not Found')
  }

  function getId(url) {
    let _url = new URL(url)
    let path = _url.pathname.split('/')
    let _id

    if(path.length === 3) {
    	_id = path[path.length - 1]
    } else {
      _id = id + '?page=' + _url.searchParams.get('page')
    }

    return _id
  }
} : function() {})()



























