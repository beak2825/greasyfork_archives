// ==UserScript==
// @name        4chan browser
// @namespace   e343367e7d795211da74d4a886e28f9c
// @description Button in catalog that shows all the images in all posts.
// @version     1.0.1
// @include     http://boards.4chan.org/*/catalog
// @include     https://boards.4chan.org/*/catalog
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/22082/4chan%20browser.user.js
// @updateURL https://update.greasyfork.org/scripts/22082/4chan%20browser.meta.js
// ==/UserScript==

(function () {
    
    const width = 200;
    const height = 200;
    const queries = {
        thread: '.thread',
        subject: '.teaser',
        image: '.fileThumb'
    };
    
    const button = document.createElement('button');
    button.innerHTML = 'Browse images';
    document.body.insertBefore(button, document.body.firstChild);
    button.addEventListener('click', () => {
        const window = open();
        const document = window.document;
        
        document.body.style.paddingTop = '20px';
        document.body.style.background = '#F1F1F1';
        
        navigation(window, document, threads(document));
    });
    
    function threads(newDocument) {
        const play = makePlay(newDocument);
        const tags = Array.from(document.querySelectorAll(queries.thread));
        return tags.map(tag => new Thread(newDocument, tag, play));
    }
    
    class Thread {
        constructor(document, tag, play) {
            let subject = tag.querySelector(queries.subject);
            if (subject) {
                subject = subject.innerHTML;
            } else {
                subject = 'Thread';
            }
            
            const a = document.createElement('a');
            a.href = tag.querySelector('a').href;
            a.innerHTML = subject;
            const p = document.createElement('p');
            p.appendChild(a);
            const loading = document.createTextNode('Loading');
            this.div = document.createElement('div');
            this.div.appendChild(p);
            this.div.appendChild(loading);
            
            this.request = new Promise((resolve, reject) => {
                const request = new XMLHttpRequest();
                request.open('GET', a.href);
                request.responseType = 'document';
                request.addEventListener('load', () => {
                    this.div.removeChild(loading);
                    
                    let images = queries.image;
                    images = request.response.querySelectorAll(images);
                    images = Array.from(images);
                    images = images.filter(image => image.href);
                    
                    this.thumbnails = images.map(image => {
                        return new Thumbnail(document, image, this.div, play);
                    });
                    
                    resolve();
                });
                request.send();
            });
        }
        
        load() {
            this.request.then(() => {
                for (let thumbnail of this.thumbnails) {
                    thumbnail.load();
                }
            });
        }
    }
    
    class Thumbnail {
        constructor(document, image, container, play) {
            this.image = image;
            
            this.img = document.createElement('img');
            this.img.style.display = 'block';
            this.img.style.margin = 'auto';
            this.img.addEventListener('error', () => {
                container.removeChild(this.div);
            });
            this.img.addEventListener('load', () => {
                if (this.img.naturalWidth > this.img.naturalHeight) {
                    this.img.width = width;
                } else {
                    this.img.height = height;
                }
            });
            
            const a = document.createElement('a');
            a.style.display = 'block';
            a.style.position = 'relative';
            a.href = image.href;
            a.target = '_blank';
            a.appendChild(this.img);

            this.div = document.createElement('div');
            this.div.style.width = width + 'px';
            this.div.style.height = height + 'px';
            this.div.style.padding = '10px';
            this.div.style.margin = '10px';
            this.div.style.borderRadius = '4px';
            this.div.style.display = 'inline-block';
            this.div.style.background = 'white';
            this.div.style.border = '1px solid #D8D8D8';
            this.div.appendChild(a);

            if (image.href.match(/.webm/)) {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                canvas.style.position = 'absolute';
                canvas.style.top = '0px';
                canvas.getContext('2d').drawImage(play, 0, 0);
                a.appendChild(canvas);
            }
            
            container.appendChild(this.div);
        }
        
        load() {
            this.img.src = this.image.querySelector('img').src;
        }
    }
    
    function navigation(window, document, threads) {
        let i = 0;
        
        const next = document.createElement('button');
        next.innerHTML = 'next';
        next.style.position = 'fixed';
        next.style.right = '0px';
        next.style.top = '0px';
        next.style.zIndex = '1';
        next.addEventListener('click', function () {
            if (i == 0) {
                document.body.appendChild(previous);
            }

            document.body.removeChild(threads[i].div);
            i += 1;
            document.body.appendChild(threads[i].div);
            threads[i].load();

            if (i == threads.length - 1) {
                document.body.removeChild(next);
            }

            window.scrollTo(0, 0);
        });
        
        const previous = document.createElement('button');
        previous.innerHTML = 'previous';
        previous.style.position = 'fixed';
        previous.style.left = '0px';
        previous.style.top = '0px';
        previous.style.zIndex = '1';
        previous.addEventListener('click', function () {
            if (i == threads.length - 1) {
                document.body.appendChild(next);
            }

            document.body.removeChild(threads[i].div);
            i -= 1;
            document.body.appendChild(threads[i].div);
            threads[i].load();

            if (i == 0) {
                document.body.removeChild(previous);
            }

            window.scrollTo(0, 0);
        });
        
        document.body.appendChild(threads[i].div);
        document.body.appendChild(next);
        threads[i].load();
        
        window.addEventListener('keydown', function (event) {
            if (event.keyCode == 37 && i > 0) {
                previous.click();
            }

            if (event.keyCode == 39 && i < threads.length - 1) {
                next.click();
            }
        });
    }
    
    function makePlay(document) {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext('2d');
        context.fillStyle = 'hsla(0, 0%, 80%, 0.25)';
        context.strokeStyle = 'hsla(0, 0%, 100%, 0.5)';
        context.lineWidth = 2;
        context.moveTo(width / 3, height / 3);
        context.lineTo(width / 3 * 2, height / 2);
        context.lineTo(width / 3, height / 3 * 2);
        context.closePath();
        context.fill();
        context.stroke();

        return canvas;
    }
})();
