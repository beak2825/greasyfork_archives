// ==UserScript==
// @name        8chan gallery script
// @namespace   https://greasyfork.org/en/users/1461449
// @match       https://8chan.moe/*/res/*
// @match       https://8chan.se/*/res/*
// @grant       GM_setValue
// @grant       GM_getValue
// @version     1.7
// @description Gallery viewer for 8chan threads
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/533750/8chan%20gallery%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/533750/8chan%20gallery%20script.meta.js
// ==/UserScript==

function addCSS(css) {
    const style = document.createElement('style');
    document.head.append(style);
    style.textContent = css;
    return style;
}

const options = new Proxy({}, {
    get: (_, prop) => {
        if (prop == "volume") {
            let e = parseFloat(localStorage.getItem('8chan-volume'));
            return isNaN(e) ? 0 : e
        } else {
            return GM_getValue(prop);
        }
    },
    set: (_, prop, value) => {
        prop == "volume" ? localStorage.setItem('8chan-volume', value) : GM_setValue(prop, value);
        return true;
    }
});

if (!options.exists) {
    options.exists = true;
    options.muteVideo = false;
    options.volume = 0.3
}

if (options.muteVideo) {
    options.volume = 0;
}

class Post {
    constructor(element, thread) {
        this.element = element;
        this.id = element.id;
        this.replies = [];

        if (thread) {
            thread.posts.push(this);
            element.querySelectorAll('.postInfo > .panelBacklinks > a').forEach(link => {
                const reply = link.textContent.replace(/\D/g, '');
                this.replies.push(reply);
            });
        }

        const details = element.querySelectorAll('details');
        this.files = Array.from(details).map(d => {
            const imgLink = d.querySelector('a.imgLink');
            if (imgLink) {
                return {
                    url: imgLink.href,
                    thumbnail: imgLink.querySelector('img')?.src,
                    name: d.querySelector('.originalNameLink')?.download || '',
                    video: d.querySelector('video') !== null,
                    parentPost: this
                };
            }
        }).filter(Boolean);
    }
    hidden() {
        return this.element.querySelector(".unhideButton") !== null;
    }
}

class Thread extends Post {
    static all = [];
    constructor(opEl) {
        super(opEl, null);
        this.posts = [this];
        Thread.all.push(this);
    }
}

class Gallery {
    constructor() {
        this.visible = false;
        this.showImages = true;
        this.showVideos = true;
        this.currentIndex = 0;
        this.rotation = 0;
        this.container = null;
        this.viewer = null;
        this.mediaEl = null;
        this.sidebar = null;
        this.previewContainer = null;
        this.previews = [];

        document.addEventListener('keyup', e => {
            if (e.key === 'g') {
                this.visible ? this.remove() : this.show();
            } else if (e.key === 'Escape' && this.visible) {
                this.remove();
            }
        });

        document.addEventListener('keydown', e => {
            if (!this.visible) return;
            switch (e.key) {
                case 'ArrowLeft':
                    this.showIndex((this.currentIndex - 1 + this.filteredMedia.length) % this.filteredMedia.length);
                    break;
                case 'ArrowRight':
                    this.showIndex((this.currentIndex + 1) % this.filteredMedia.length);
                    break;
                case 'r':
                    if (!e.ctrlKey) this.rotate();
                    break;
            }
        });
    }

    mediaItems() {
        return this.thread.posts.flatMap(p => (p.files || []).filter(f => !p.hidden() && (f.video ? this.showVideos : this.showImages)));
    }

    show() {
        if (!this.container) this.buildUI();

        const op = document.querySelector('div.opCell .innerOP');
        if (!op) return;
        this.thread = new Thread(op);
        document.querySelectorAll('div.opCell .divPosts > div').forEach(el => new Post(el, this.thread));

        document.body.append(this.container);
        this.visible = true;
        this.updatePreviews();
        this.currentIndex = this.getClosestPost();
        this.showIndex(this.currentIndex);
    }

    getClosestPost() {
        const centerY = window.innerHeight / 2;
        let best = { idx: 0, dist: Infinity };
    
        this.mediaItems().forEach((media, i) => {
            const rect = media.parentPost?.element.getBoundingClientRect();
            if (rect) {
                const postCenter = rect.top + rect.height / 2;
                const dist = Math.abs(postCenter - centerY);
                if (dist < best.dist) best = { idx: i, dist };
            }
        });
    
        return best.idx;
    }
    

    remove() {
        if (this.container) this.container.remove();
        this.visible = false;
        this.mediaEl.onmouseout();
    }

    addMediaScroll(mediaEl) {
        let supportsPassive = false;
        try {
            window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
                get: function () { supportsPassive = true; }
            }));
        } catch (e) { }

        let wheelOpt = supportsPassive ? { passive: false } : false;
        let wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

        function handleScroll(e) {
            e.preventDefault();
            mediaEl.volume += (e.deltaY < 0 ? 0.02 : -0.02);
            mediaEl.volume = Math.min(Math.max(mediaEl.volume, 0), 1);
        }

        mediaEl.onmouseover = () => {
            window.addEventListener(wheelEvent, handleScroll, wheelOpt);
        };

        mediaEl.onmouseout = () => {
            window.removeEventListener(wheelEvent, handleScroll, wheelOpt);
        };
    }

    buildUI() {
        this.container = document.createElement('div');
        Object.assign(this.container.style, {
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.7)', display: 'flex', zIndex: 9999
        });

        this.viewer = document.createElement('div');
        Object.assign(this.viewer.style, {
            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
        });
        this.viewer.addEventListener('click', (e) => {
            if (e.target === this.viewer) this.remove();
        });

        this.labelsDiv = document.createElement("div");
        this.labelsDiv.id = "gallery-labels";

        let infoLabels = document.createElement("div");
        infoLabels.setAttribute("id", "gallery-labels-info");
        Object.assign(infoLabels.style, {
            position: "absolute", display: "flex", flexDirection: "column",
            alignItems: "flex-end", bottom: "5px", right: "5px", borderRadius: "3px", zIndex: "59"
        });

        this.filenameLabel = document.createElement("a");
        this.filenameLabel.classList.add("gallery-label");
        this.filenameLabel.id = "gallery-label-filename"
        this.filenameLabel.style.color = "white";

        this.indexLabel = document.createElement("a");
        this.indexLabel.classList.add("gallery-label");
        this.indexLabel.id = "gallery-label-index"
        this.indexLabel.style.color = "white";

        infoLabels.append(this.indexLabel, this.filenameLabel);

        this.filterLabels = document.createElement("div");
        Object.assign(this.filterLabels.style, {
            position: "absolute", display: "flex", flexDirection: "column",
            alignItems: "flex-end", top: "5px", right: "5px", borderRadius: "3px", zIndex: "59"
        });

        const createFilterLabel = (id, text, toggleFn) => {
            const label = document.createElement("a");
            label.id = id;
            label.textContent = text;
            label.classList.add("gallery-label");
            label.style.color = "white";
            label.style.cursor = 'pointer';
            label.addEventListener('click', toggleFn);
            return label;
        };

        const imageLabel = createFilterLabel("gallery-label-image", "Images", () => {
            this.showImages = !this.showImages;
            imageLabel.style.color = this.showImages ? "white" : "red";
            const currentMedia = this.filteredMedia[this.currentIndex];
            this.updatePreviews();
            if (this.filteredMedia) {
                let newIndex = this.filteredMedia.indexOf(this.filteredMedia.find(el => el == currentMedia));
                if (newIndex == -1) {
                    newIndex = this.getClosestPost();
                    this.showIndex(newIndex)
                } else {
                    this.showIndex(newIndex, false);
                }
            }
        });

        const videoLabel = createFilterLabel("gallery-label-video", "Videos", () => {
            this.showVideos = !this.showVideos;
            videoLabel.style.color = this.showVideos ? "white" : "red";
            const currentMedia = this.filteredMedia[this.currentIndex];
            this.updatePreviews();
            if (this.filteredMedia) {
                let newIndex = this.filteredMedia.indexOf(this.filteredMedia.find(el => el == currentMedia));
                if (newIndex == -1) {
                    newIndex = this.getClosestPost();
                }
                this.showIndex(newIndex)
            }
        });

        this.filterLabels.append(imageLabel, videoLabel);
        this.labelsDiv.append(this.filterLabels, infoLabels);
        this.viewer.append(this.labelsDiv);

        this.mediaEl = document.createElement('video');
        this.mediaEl.controls = true;
        this.mediaEl.loop = true;
        this.mediaEl.style.maxWidth = '90vw';
        this.mediaEl.style.height = '94vh';
        this.mediaEl.style.objectFit = 'contain';
        this.mediaEl.addEventListener('volumechange', () => { options.volume = this.mediaEl.volume; });
        this.addMediaScroll(this.mediaEl);

        this.mediaContainer = document.createElement('div');
        this.mediaContainer.append(this.mediaEl);
        this.viewer.append(this.mediaContainer);

        this.sidebar = document.createElement('div');
        this.sidebar.id = 'gallery-sidebar';
        this.sidebar.tabIndex = 0;
        this.sidebar.addEventListener('wheel', (e) => {
            const delta = e.deltaY;
            const atTop = this.sidebar.scrollTop === 0;
            const atBottom = this.sidebar.scrollHeight - this.sidebar.clientHeight === this.sidebar.scrollTop;
        
            if ((delta < 0 && atTop) || (delta > 0 && atBottom)) {
                e.preventDefault();
            }
        }, { passive: false });        
        Object.assign(this.sidebar.style, {
            width: '150px', background: 'rgba(0,0,0,0.6)', padding: '5px', overflowY: 'auto'
        });

        this.previewContainer = document.createElement('div');
        this.sidebar.append(this.previewContainer);
        this.container.append(this.viewer, this.sidebar);

        addCSS(`
        /* Explicit color for filter labels to ensure visibility */
        #gallery-label-image, #gallery-label-video, #gallery-label-mute { color: white; }
        #gallery-label-image:hover, #gallery-label-video:hover, #gallery-label-mute:hover, #gallery-label-filename:hover { background: rgba(50, 50, 50, 0.8) !important; }

        /* Ensure labels are above media elements */
        #gallery-labels { z-index: 10; }

        #gallery-sidebar { scrollbar-width: thin; scrollbar-color: #555 #222; }
        #gallery-sidebar::-webkit-scrollbar { width: 8px; }
        #gallery-sidebar::-webkit-scrollbar-track { background: #222; }
        #gallery-sidebar::-webkit-scrollbar-thumb { background-color: #555; border-radius: 4px; border: 2px solid #222; }

        .gallery-thumb { display: block; width: calc(100% - 10px); margin: 0 auto 8px auto; cursor: pointer; opacity: 0.6; transition: opacity 0.2s ease-in-out, border-color 0.2s ease-in-out; border: 2px solid transparent; border-radius: 3px; box-sizing: border-box; background-color: #111; /* Add background for missing thumbs */ min-height: 50px; /* Min height for missing thumbs */ }
        .gallery-thumb:hover { opacity: 0.85; }
        .gallery-thumb.selected { opacity: 1; border: 2px solid #00baff; }

        #gallery-labels { pointer-events: none; }
        #gallery-labels > div { position: absolute; right: 10px; display: flex; flex-direction: column; align-items: flex-end; pointer-events: auto; }
        #gallery-labels-info { bottom: 10px; }
        #gallery-labels-filters { top: 10px; }

        .gallery-label { display: block; padding: 3px 6px; background: rgba(0, 0, 0, 0.7) !important; margin-bottom: 4px; font-size: 0.9em; text-decoration: none; border-radius: 3px; transition: background-color 0.2s; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 250px; }
        .gallery-filter-label.gallery-label { cursor: pointer; }
        #gallery-label-index.gallery-label { user-select: none; cursor: pointer; /* Make index clickable to scroll */ }
        #gallery-label-index.gallery-label:hover {cursor: unset !important}
        `);
    }

    updatePreviews() {
        this.previewContainer.innerHTML = '';
        this.filteredMedia = this.mediaItems();
        this.previews = [];
        this.filteredMedia.forEach((media, idx) => {
            const thumb = document.createElement('img');
            thumb.src = media.thumbnail;
            thumb.title = media.name;
            thumb.className = 'gallery-thumb';

            thumb.addEventListener('click', () => this.showIndex(idx));

            const wrapper = document.createElement('div');
            wrapper.style.position = 'relative';
            wrapper.appendChild(thumb);
            
            const replyLen = media.parentPost?.replies?.length || 0;
            if (replyLen > 0) {
                const replyCount = document.createElement('div');
                replyCount.textContent = replyLen;
                Object.assign(replyCount.style, {
                    position: 'absolute',
                    top: '3px',
                    right: '3px',
                    background: 'rgba(0,0,0,0.6)',
                    color: '#fff',
                    padding: '2px 5px',
                    fontSize: '13px',
                    borderRadius: '3px',
                    pointerEvents: 'none'
                });
                wrapper.appendChild(replyCount);
            }
            
            this.previewContainer.append(wrapper);
            this.previews.push(thumb);
        });
    }

    updateLabels(media) {
        this.filenameLabel.textContent = media.name;
        this.filenameLabel.setAttribute("href", media.url);
        this.indexLabel.textContent = (this.currentIndex + 1) + " / " + this.filteredMedia.length;
    }

    showIndex(idx, updateMedia = true) {
        this.currentIndex = idx;
        this.previews.forEach((t, i) => t.classList.toggle('selected', i === idx));
        this.previews[idx].scrollIntoView({ behavior: 'auto', block: 'center' });

        const media = this.filteredMedia[idx];
        Array.from(this.mediaContainer.querySelectorAll('img')).forEach(img => img.remove());

        this.updateLabels(media);

        if (updateMedia) {
            if (media.video) {
                this.mediaEl.style.display = '';
                this.mediaEl.src = media.url;
                this.mediaEl.volume = options.volume;
                this.mediaEl.play().catch(() => {});
            } else {
                this.mediaEl.pause();
                this.mediaEl.style.display = 'none';
                const img = document.createElement('img');
                img.src = media.url;
                img.style.maxWidth = '90vw';
                img.style.height = '98vh';
                img.style.objectFit = 'contain';
                this.mediaContainer.append(img);
            }
    
            this.rotation = 0;
            this.mediaContainer.style.transform = 'rotate(0deg)';
    
            media.parentPost?.element.scrollIntoView({ behavior: 'auto', block: 'center' });
        }
    }

    rotate() {
        this.rotation = (this.rotation + 90) % 360;
        this.mediaContainer.style.transform = `rotate(${this.rotation}deg)`;
    }
}

(() => {
    const op = document.querySelector('div.opCell .innerOP');
    if (!op) return;
    new Gallery();
})();