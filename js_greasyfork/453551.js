// ==UserScript==
// @name Sponsor Block Integration | Invidious
// @description automatically skip sponsor fragments in invidious
// @namespace -
// @version 1.3.0
// @author NotYou
// @include *://invidious.snopyta.org/watch?v=*
// @include *://yewtu.be/watch?v=*
// @include *://invidious.kavin.rocks/watch?v=*
// @include *://vid.puffyan.us/watch?v=*
// @include *://invidious.namazso.eu/watch?v=*
// @include *://inv.riverside.rocks/watch?v=*
// @include *://youtube.076.ne.jp/watch?v=*
// @include *://yt.artemislena.eu/watch?v=*
// @include *://invidious.flokinet.to/watch?v=*
// @include *://invidious.esmailelbob.xyz/watch?v=*
// @include *://invidious.projectsegfau.lt/watch?v=*
// @include *://inv.bp.projectsegfau.lt/watch?v=*
// @include *://y.com.sb/watch?v=*
// @include *://invidious.sethforprivacy.com/watch?v=*
// @include *://invidious.tiekoetter.com/watch?v=*
// @include *://invidious.nerdvpn.de/watch?v=*
// @include *://inv.vern.cc/watch?v=*
// @include *://invidious.slipfox.xyz/watch?v=*
// @include *://inv.privacy.com.de/watch?v=*
// @include *://invidious.rhyshl.live/watch?v=*
// @include *://invidio.xamh.de/watch?v=*
// @include *://invidious.dhusch.de/watch?v=*
// @include *://inv.odyssey346.dev/watch?v=*
// @include *://c7hqkpkpemu6e7emz5b4vyz7idjgdvgaaa3dyimmeojqbgpea3xqjoid.onion/watch?v=*
// @include *://w6ijuptxiku4xpnnaetxvnkc5vqcdu7mgns2u77qefoixi63vbvnpnqd.onion/watch?v=*
// @include *://kbjggqkzv65ivcqj6bumvp337z6264huv5kpkwuv6gu5yjiskvan7fad.onion/watch?v=*
// @include *://grwp24hodrefzvjjuccrkw3mjq4tzhaaq32amf33dzpmuxe7ilepcmad.onion/watch?v=*
// @include *://osbivz6guyeahrwp2lnwyjk2xos342h4ocsxyqrlaopqjuhwn2djiiyd.onion/watch?v=*
// @include *://u2cvlit75owumwpy4dj2hsmvkq7nvrclkpht7xgyye2pyoxhpmclkrad.onion/watch?v=*
// @include *://euxxcnhsynwmfidvhjf6uzptsmh4dipkmgdmcmxxuo7tunp3ad2jrwyd.onion/watch?v=*
// @include *://invidious.esmail5pdn24shtvieloeedh7ehz3nrwcdivnfhfcedl7gf4kwddhkqd.onion/watch?v=*
// @include *://inv.vernccvbvyi5qhfzyqengccj7lkove6bjot2xhh5kajhwvidqafczrad.onion/watch?v=*
// @include *://am74vkcrjp2d5v36lcdqgsj2m6x36tbrkhsruoegwfcizzabnfgf5zyd.onion/watch?v=*
// @include *://ng27owmagn5amdm7l5s3rsqxwscl5ynppnis5dqcasogkyxcfqn7psid.onion/watch?v=*
// @include *://verni6dr4qxjgjumnvesxerh5rvhv6oy5ddeibaqy5d7tgbiiyfa.b32.i2p/watch?v=*
// @license GPL-3.0-or-later
// @grant none
// @run-at document-end
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAABmJLR0QAwwDDAMPGcpJnAAAACXBIWXMAAC4jAAAuIwF4pT92AAAKgUlEQVRo3u2Y+09bZ5rHP++5+3Jsg20gDeCEQMkGGtJMm5nRzvw0o9Vqbq16iVopqmakXe2/sfvntOqM+sNKndltQ1e59EJoU0IaaBNyBQwxBtv4cuxzzrs/nBdKUhLIzK60WvFIlsH2Oef7fS7f53kfOLADO7ADO7C/wcSzXvDqq69qmqahaZqmrpdSylAIId9//335f5LAm2++adi2bTuO023b9nO2bfdaltWlaZoZhqHXbrfXPc8rtlqt5Xa7vd5ut7133303kNH9BaDtuJ3c8S4BKf43CJw9e1boum4lEolcb2/vyXw+fyabzU5kMpmhZDKZsyzL0jRND8Mw8DyvVa1WSxsbG7dKpdJ0qVT6PLmyMveHqanWc7OzLpAADAU4BDpAC2gCHtAGfCB4VjLGbh+eO3dOz2Qy2Ww2+1JfX99vCoXC3x86dGggnU4n4vG4aRgGQojtZ4VhKH3fP9xoNMbK5fIvlpaWbpUWFi7fbbfvuJ6XTt65Exedzk7vhwp8BVgGHgBLQFlCQxGRf1UE3nnnHTOfz48MDQ396siRI6/29/efzGaziVgspum6/tSbSSkJw5B6vR4+LBY3KzdurCauXLlW+OKLy7nZ2RW9XpeAIcERkJaQE5BWhFaB68CsIrWpohKK/Ubg9ddf19Pp9ImRkZF/fuGFF341MDBwOJFIWJqmscPhT/aGEOi6juu6WiwWc2tdXfHFTCZxNwj646VSLXnnji+CwBMRuHUBZWBFpVASeBk4DdwGZoBbwLqEzpMisk3gjTfe0FKp1MDx48f/6fTp028WCoWcZVnafoDvRsQ0TdGVyxn6xETfQqvVc291lWONhnSKRYmUgaqDJrAO3APmgbsqGoPAMPAtMAXclFAX0Xc/JPDWW29p6XR6YGRk5F9OnTr1+sDAQM62bY1dpEM8IxE3lRKFl17S79frJFotBi5eRN/YMAFHeT2nwP4EuA9MA1cltAUUgDzwKXBNRmR98TgB13VTg4OD/zAxMfFaoVDocRznEfCBhGoHWgFkLIjp+yehaRpd3d00f/QjlpaW6L5/H7dWQwRBxFBuq2gSGAUGgAkBl4HvlIL9EugFPgcWJXhbF+nnzp3TDx8+PDY+Pv77sbGxl1zXtaIe9b15IcxU4KsK5GxIGfAsmSWEwI7F2AD8YpH0ygp6GEImA7YNvg9huNUvLCAv4Zgq8BVgA3gOyABVoPavEPwbYFiWFe/t7X15YGDglOu6zuPgAXQBXRZ0JMQ0+WzolVmWRfeRIzwcH6d3fp60riOGhmBzE+bm4PZtCIKtLNUFdAM/BXqAvyiZHVbZ7Et4EELbcF23N5/P/7i7u7tX1/VdkVkajLpQMFtsVip4pLFtm2cpcCEEbibD2sgI1SNHcIeG0H/+c6hU4KOPoNWCxUWQcqfE2xKGBZjApCr2YVXoF4AHRiqVOprJZP4uFovZu3l/ZxSCTpvZ2Vkcx+H555+nu7ubvXrD41FI9PbSLBQIxsbQx8eh3YZ6HYrFiEyt9ijvKKWOqvQ6L+GOgCMiaoI1w3XdoVQq1WdZ1p5IdF0nDEOmpqaoVqucPHmSnp4eTNPcFwFd14ml07QPHyYcGoJcDjQNTp+G5WUolWBmBqKuvTMShpLWnwp4qKR3ELilv/LKK787duzYzzKZTEzTNLFXp200GjiOQ7FYpFQq4TgOiUQCXdf3lVLtVot2tUpmdBQznwfLgngcdD2qh5UV2NjYbWLQgDjRqLGsPl/TLMvKmKZp7gV+y4OpVIrR0VHOnDlDrVZjcnKS+fl5Wq0WUsq9O7VhILNZZDodgdY0SKXg+HF4+WUYG4v+f4IPVQPcIhUauq4b+wG/pemmaRIEAUNDQyQSCaanp7lw4QLVapUTJ06QTqefWBdbs5JIJhGO872a6Trk83DqVJRK5TJcvQrN5iPtSCnRt+rvTWDV8H3fC4Ig3Mt7Wx60LIuNjQ00TaO/vx/Hcbh+/TrXr1+n0WgwNjb21LrwfR8tFkMzzUhxtp5rmjA4CGfORAVdKsHNm1vfS6X/swp4DJiTsGa0Wq0Nz/M6MmIg9kOg0+kQBAGWZdHT00M8HieVSnHjxg1qtRoTExMMDAxg2/Yj14dhSNvzMA0DzfMi3Q+CqJF1OpEixWLQ1wfZLNy6FZ33os47r+alGFEh3wQ2jWq1Wtzc3Nz0fb/LMIw9U2kLlO/722nlui7j4+Mkk0m+/PJLLl68yIsvvsjw8DDxeHy7uH3fp14q0Vetot+5E6XI5mb0qtWi97U1WFiAu3dRRdUWsAB8BtQVjKvAfQG+UavVvi2Xy6utVus527b3nD4Nw0DTNDqdDlJKhBAIIYjFYhw7doxEIsHU1BSXLl1C13VGRka2SderVTrXrpE4fx6xuAiNRkSi1Ypevv/9KwxRBXsP+ARYlmADXwv4hmg6lUaz2ZyvVCpXarXaqOu65l6NSdd1LMvC9/0fqI5lWfT39xOPx1lbWyOXy2EY0cTe6XRYv3eP1MwM8atX0R7turupja9OaudVunSpSHytzhIhgNbpdNbK5fInq6ur9zzPC/ejRI7jbEdgt++z2SzDw8PbnVpKSaVcxp+ZoW9+Huvhw6eBD5XW3wI+VhNpt1Kgy8CyiFQoel673e4sLy9PLywsfLa6utrYyu2nFbLjOLTb7SeS2DqZRdNy1PxWv/mG7Oefk7p9G63d3s3jUkbA1oErwB8V+Iw66PyXen+kTetfffUVR48ebSglGsnlcn2xWEx/Ui1IKanVaiwvL+M4DvF4nKfNUK1Wi/tzc7794YeycOGC5iwuIsLwcfAB0BLRufgy8GcVhV6lPB9JBf7xJ+kA165dCwYHB1ebzeZGPB4/6rpu1rZtYzdgUko6nQ7JZJJ0Oo1pmruOEFJKPM+TS7dv11qTkw+e//BDkbx509F8X+zYCXWUrt8HvgD+g6hAXTU2TKupsyjA381N2xU7MjLieZ53NwiCumEYPbZtd1mWZeq6vnODEh1ObJtkMrkreCklQRDIer0eLN68uV759NNrRycnr+SvXrV0z0srbzeANVWcl4D/BG4ojc+pfP9YESgLdXjhaQTm5uYYHR1tB0Fwv9lsLrfbbTMMw6xpmgnDMLSdm4kt6XzcgiCg0WiExWKx9t38/NfNzz775MTHH6/0zcwsmZXK2o7i/FSBPk+kLN3AkIrG5I7Zv7XXfugHKN5++22RTCZj2Wx2OJvN/uOhQ4d+WygUjvf29qaTyaRhWZbYmVphGG57fG1trb64uHj3wYMH5yvF4r//enp6ZezSpZ8Y1epR5fGqclpMFaerVir3VAS+U7/z/urF1o41izBNMxGLxYb6+vp+1tfX9+N8Pj+ayWR64vF4QtM0XUoZeJ7nVSqVcrlcXlhZWZleXV29uLGxcb1er6//8U9/EuosewYYUwf0jiJSUsDvqnNvXaXXM+1K9/zt2bNnNcuybMdxMrFYrMdxnB7Lsrp0XbfCMPR93682m81Ss9lcaTab657nNd577z1/h8QICaaAFODIiEBDRDvRPTdv/6Pr9ddee01smZRSqB4QhmEoP/jgg32FXG2s/6aN9IEd2IEd2IEd2P8b+2+c+4j5Ds7VWQAAAABJRU5ErkJggg==
// @downloadURL https://update.greasyfork.org/scripts/453551/Sponsor%20Block%20Integration%20%7C%20Invidious.user.js
// @updateURL https://update.greasyfork.org/scripts/453551/Sponsor%20Block%20Integration%20%7C%20Invidious.meta.js
// ==/UserScript==

(function init() {
  /* To enable fragment skipping change from "true" to "false" (without quotes), to disable do the opposite. */
	const categories = {
		sponsor: true,
		intro: false,
		outro: false,
		music_offtopic: false,
		selfpromo: true,
		interaction: true,
  }

	/* Write here minimal duration of the fragment, if duration will be less than this, then fragment won't be skipped. */
  const minimalDuration = 0

	/* Write here minimal votes for the fragment, if votes will be less than this, then fragment won't be skipped */
  const minimalVotes = 0 

  const colors = {
    sponsor: 'rgb(0, 212, 0)',
    intro: 'rgb(0, 255, 255)',
    outro: 'rgb(2, 2, 237)',
    music_offtopic: 'rgb(255, 153, 0)',
    selfpromo: 'rgb(255, 255, 0)',
    interaction: 'rgb(204, 0, 255)',
  }

  const videoData = document.querySelector('#video_data')

	if(!videoData) {
    setTimeout(init, 250)
  }

  const categoriesSearchParams = Object.keys(categories)
  	.filter(e => categories[e])
  	.map(e => 'category=' + e)
  	.join('&')

  const id = JSON.parse(videoData.textContent).id
	const url = 'https://sponsor.ajay.app/api/skipSegments?videoID=' + id + '&' + categoriesSearchParams
  const video = document.querySelector('video')
  const isPlayerJS = !document.querySelector('video#player')
  const segments = []
  const css = 'height: 100%;position: absolute;z-index: 1;'

  getSkipSegment().then(res => {
    for (let i = 0; i < res.length; i++) {
      const current = res[i]

      if(current.votes > minimalVotes - 1) {
      	const segment = current.segment
        const duration = current.videoDuration || video.duration
      	const left = segment[0] / duration * 100 + '%'
      	const width = (segment[1] - segment[0]) / duration * 100 + '%'
        const segmentDuration = segment[1] - segment[0]

        if(segmentDuration > minimalDuration) {
        	segments.push(segment)
      		createSegment(left, width, colors[current.category])
        }
      }
    }

    if(res.length > 0) {
      skipSponsor()

      video.addEventListener('timeupdate', skipSponsor)
    }
  })

  function skipSponsor() {
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      const currentTime = video.currentTime

      if(currentTime > segment[0] && currentTime < segment[1]) {
        video.currentTime = segment[1]
      }
    }
  }

  function createSegment(left, width, color){
    if(isPlayerJS) {
      const segmentNode = document.createElement('div')
      segmentNode.style.cssText = `
			left: ${left};
			width: ${width};
			background-color: ${color};
			${css}`
      document.querySelector('.vjs-progress-holder').appendChild(segmentNode)
    }
  }

  async function getSkipSegment() {
    const result = await fetch(url).then(r => r.json()).then(c => {
      return c
    }).catch(() => {
      console.error('Sponsor Block Integration: Server Error or Intergration Not Found.')
      return []
    })

    return result
  }
})()
