// ==UserScript==
// @name         Starve.io Private server.
// @namespace    starve.io
// @version      3.0
// @description  Private server by Zero! New modes and updates coming soon.
// @author       Nissy
// @run-at       document-ready
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @match        *://starve.io
// @downloadURL https://update.greasyfork.org/scripts/387869/Starveio%20Private%20server.user.js
// @updateURL https://update.greasyfork.org/scripts/387869/Starveio%20Private%20server.meta.js
// ==/UserScript==


for (i = i7.Gv[0].length; i > 0; i--) {
    i7.Gv[0][i] = i7.Gv[0][i-1]
}

javascript:(function(){ $.get("https://mf2.starveserver.tk/info" ) .done(function( data ) { i7.Gv[0].unshift(data); i7.oL(0); $(".md-select").click(); $(".md-select ul li")[1].click() }) .fail(function(data) { alert("Can't connect to server | Server might be offline!") }); })();

document.documentElement.classList.add(
  'extstyler',
  ...location.hostname
    .split('.')
    .reverse()
    .slice(1)
    .reverse()
)

let aa = document.getElementsByTagName('span');
for (elt of aa) {
	elt.innerHTML = '<a href="https://discord.gg/pcMjxs2" target="blank_" +>Join Discord Servers</a>';
	elt.style['background-color'] = 'darkblue';
		elt.style['background-color'] = 'blue';
			elt.style['background-color'] = 'red';
				elt.style['background-color'] = 'yellow';
	elt.style['float'] = 'center';
	elt.style['position'] = 'relative';
	elt.style['right'] = '725px';
	elt.style['font-size'] = '13px';
	elt.style['padding'] = '10px';
}

let bb = document.getElementsByTagName('a');
for (elt of bb) {
	elt.style['text-decoration'] = 'none';


}

let cc = document.getElementsByTagName('button');
for (elt of cc) {
	elt.style['background-color'] = 'red';
	elt.style['color'] = 'green';

}



let ff = document.getElementsById('trevda');
for (elt of ff) {
	elt.src = ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMTEBUSEhIVFRUVFxYYFxYYFhcYGhgYFxYYFhUYGBgYHSggGR4mHRYYITEhJSkrLi4vGCI1ODMtNygtLisBCgoKDg0OGxAQGy0lHyUtLS0tLS0tLS0tLS0vLS0tLS0tLS0tNS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALcBEwMBIgACEQEDEQH/xAAcAAACAwEBAQEAAAAAAAAAAAADBAIFBgABBwj/xABDEAACAQMCBAMFBgMGBQMFAAABAhEAAyESMQQFIkETUWEGMnGBkSNCobHB0RRT8BVSYpLh8RYzQ3KCNKLCB1Rjk+L/xAAaAQADAQEBAQAAAAAAAAAAAAAAAQIDBAUG/8QALxEAAgIBAwMDAgQHAQAAAAAAAAECERIDITETQVEEYaEiQjKBkeFScbHB0fDxFP/aAAwDAQACEQMRAD8AtkSiqlEVKIqV6dnFRBUoqpU1SiqlS2UkDVKKqURUoqpUtjoEtuiLboqpRVt1DZVAlt1NbdHVKmLdS2VQBbdTFujqlTFulkFC/h174dMhKkLdTY6FfDrvDpvw67w6LGKeHXnh02bdeFKLFQn4dRNunClRKU7ChM26gbdOlKgUqshUJslDKU6yVApTsmhEpUClOm3Q2SqsTQkyVBkpxkobJVWKhMpUGSm2ShlKaYqFClDZKbZKgyU7FQkyUNrdOslDKVSYqE/Drqa0V7TsKHFSjKlTVKKqVk2XRBUoqpU1SjKlS2VQNbdFW3RFSiqlQ5FJA1SiqlEVKIqVDY6BqlTCUVUogSpyHQFbdSA7f1mocdeFtdZIADAMfIExVTzDmXh+IWiE0aodTA1hlbJGCpk9xmAaVjLO5xCrE7EwfQzH5wMedF8Zc5wN6+bc09q213FVh0m6bYwSzSbOzHEOUI0jPhtiDNN8m9qvEd1JJVrkKJC6iSAwDGMqNOCYIY5xSsWSPoBuAT6f7/gI+teLdBMeZj6gn6dJrEv7RKt68Xuqot22KqV1BmViishgKSWJECdo6SDFny/mYN5V1OwADg6YWDZEaT3BOtgc4nIFLJFGlx/X9elelKzHI+PuXGnxAQWLlT90BmXpDGVB0MMkxqGN6vE5vbLFfUxH9wKTrIMQJVl/qaFNMKGSlRK0pxXNVBKrpLBreoFgCEcpLfRoB2nvXjceFKqSCXVGBkRMDVkdgBr32mnYhspUSlecNxSuCwI0j17aQZPlM0xG3rVWIUZKGUp0pQ2SnYUJMlQZKcKUNkqrFQmyUJkp1koZSqTJaEmShlKcZKGUqkxCbJUGSmylQZKpMVCZSoFKbKVApTsmhXRXUxorqYUOKlGVKmqUVUrJs0SIKlFVKmqUVUqGykiKLRVSpKlFValsdEVSiBamq1MLUWVRALQeL4tbcF8Ke+YB9TsO/ftTGsBozn0MbxvtPp6UpzXi7SKTeH2YB1NEhTj3gM7Hf0zGJVjMt7T84UXGtLPUhYQNSymSryAUkIQRJA0iRk1mecc0F1LdxXECwbbrpMJOlilwsG1ADUQwAaLgjfAeZlbxc8MqG3q1QsFgANIm3JZgFVcaT7pzMxW8BwTomrxFOohYDdpUo5GAVmIgeR8ohyM92yfD8EjWGUaCbIJiGZnUsdbjWNh9l14gsvmK9scmbU1tVlJu6G6hAW2'];
}