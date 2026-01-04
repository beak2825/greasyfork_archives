// ==UserScript==
// @name            Фильтр для Ficbook
// @description     Фильтровать фанфики по разным параметрам.
// @license         MIT
// @namespace       https://github.com/MonkAlex/FicbookFilter
// @include         htt*://ficbook.net/*
// @exclude         htt*://ficbook.net/home/collections?type=update
// @exclude         htt*://ficbook.net/home/change_*
// @grant           none
// @require         http://code.jquery.com/jquery-latest.min.js
// @version         2019.09.25a
// @author          MonkAlex
// @downloadURL https://update.greasyfork.org/scripts/390488/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20Ficbook.user.js
// @updateURL https://update.greasyfork.org/scripts/390488/%D0%A4%D0%B8%D0%BB%D1%8C%D1%82%D1%80%20%D0%B4%D0%BB%D1%8F%20Ficbook.meta.js
// ==/UserScript==

/** Все фанфики на странице **/
let globalFanfics = new Set();

function setBannedAuthors(authorsId) {
    localStorage.setItem(
        'ficbookFilter.bannedAuthors',
        JSON.stringify(authorsId)
    )
}

function setBannedFanfics(fanficsId) {
    localStorage.setItem(
        'ficbookFilter.bannedFanfics',
        JSON.stringify(fanficsId)
    )
}

function setBannedDirections(directions) {
    localStorage.setItem('ficbookFilter.bannedDirections', JSON.stringify(directions))
}

function setBannedFandoms(fandoms) {
    localStorage.setItem('ficbookFilter.bannedFandoms', JSON.stringify(fandoms))
}

function setBannedPairings(pairings) {
    localStorage.setItem('ficbookFilter.bannedPairings', JSON.stringify(pairings))
}

function getBannedAuthors() {
    const str = localStorage.getItem('ficbookFilter.bannedAuthors');
    return str ? JSON.parse(str) : []
}

function getBannedFanfics() {
    const str = localStorage.getItem('ficbookFilter.bannedFanfics');
    return str ? JSON.parse(str) : []
}

function getBannedDirections() {
    const str = localStorage.getItem('ficbookFilter.bannedDirections');
    return str ? JSON.parse(str) : []
}

function getBannedFandoms() {
    const str = localStorage.getItem('ficbookFilter.bannedFandoms');
    return str ? JSON.parse(str) : []
}

function getBannedPairings() {
    const str = localStorage.getItem('ficbookFilter.bannedPairings');
    return str ? JSON.parse(str) : []
}

/**
 * Добавить кнопку "заблокировать".
 * @param root элемент, к которому прицепится кнопка.
 * @param title текст при наведении.
 * @param inSup true, если это кнопки у загловока, там дополнительно используется sup элемент.
 * @param fanfic контекст выполнения, по идее - фанфик.
 * @param color цвет иконки.
 * @param click обработчик нажатия на кнопку.
 * @returns {HTMLElement} собственно кнопка, к которой потом можно повесить обработчик.
 */
function addButton(root, title, inSup, fanfic, color, click) {
    let button = document.createElement("button");
    button.innerHTML = '<svg viewBox="0 0 32 32" width="16" fill="' + color +'">\n' +
        '<path d="M32 11.2c0 2.7-1.16 5.12-3.02 6.8H29L19 28c-1 1-2 2-3 2s-2-1-3-2L3.02 18A9.2 9.2 0 0 1 13.93 3.31L11 8l7 4-4 10 11-12-7-4 2.46-3.7A9.2 9.2 0 0 1 32 11.2z"></path>\n' +
        '</svg>';
    button.title = title;

    let bs = button.style;
    bs.padding = '0px';
    bs.background = 'none';
    bs.border = 'none';

    button.fanfic = fanfic;
    button.addEventListener("click", click);

    if (inSup) {
        let sup = document.createElement("sup");
        sup.className = "count";
        sup.appendChild(button);
        button = sup;
    }
    root.appendChild(button);
    return button;
}

class FanficFandom {
    constructor(fanfic, fandom){
        this.fanfic = fanfic;
        this.fandom = fandom;
        this.wrapper = $(fandom).wrap("<a/>")[0].parentElement;
        this.fandomUri = this.fandom.href.match('\/fanfiction\/(.*)')[1];

        this.fandomBtn = addButton(this.wrapper, 'Забанить фандом', false, this, 'rgb(180, 0, 0)', function () {
            this.fanfic.banFandom();
        });
        this.restoreFandomBtn = addButton(this.wrapper, "Вернуть фандом", false, this, 'rgb(220, 220, 0)', function () {
            this.fanfic.restoreFandom();
        });
        this.restoreFandomBtn.style.display = "none";
    }

    restoreFandom(){
        let tempFandoms = getBannedFandoms();
        if (tempFandoms.includes(this.fandomUri)) {
            tempFandoms.splice(tempFandoms.indexOf(this.fandomUri), 1);
            setBannedFandoms(tempFandoms);
            console.warn('restore fandom ' + this.fandomUri);
        }
        globalFanfics.forEach(function (fanfic) {
            fanfic.unHideFanfic();
        })
    }

    banFandom() {
        console.warn('hide fandom ' + this.fandomUri);
        let bannedFandoms = getBannedFandoms();
        bannedFandoms.push(this.fandomUri);
        setBannedFandoms(bannedFandoms);
        globalFanfics.forEach(function (fanfic) {
            fanfic.hideFanfic();
        });
    }

    fandomBanned() {
        return getBannedFandoms().includes(this.fandomUri);
    }

    hide(){
        let disliked_parameter_link = " disliked-parameter-link";

        if (this.fandomBanned())
        {
            if (!this.fandom.className.includes(disliked_parameter_link))
            {
                this.fandom.className += disliked_parameter_link;
            }
            this.restoreFandomBtn.style.display = "";
            this.fandomBtn.style.display = "none";
        }
    }

    unHide(){
        let disliked_parameter_link = " disliked-parameter-link";
        if (!this.fandomBanned())
        {
            this.fandom.className = this.fandom.className.replace(disliked_parameter_link, "");
            this.restoreFandomBtn.style.display = "none";
            this.fandomBtn.style.display = "";
        }
    }
}
class FanficPairing {
    constructor(fanfic, pairing){
        this.fanfic = fanfic;
        this.pairing = pairing;
        this.wrapper = $(pairing).wrap("<a/>")[0].parentElement;
        this.pairingUri = decodeURI(this.pairing.href.match('\/pairings\/(.*)')[1]);

        this.pairingBtn = addButton(this.wrapper, 'Забанить пейринг', false, this, 'rgb(180, 0, 0)', function () {
            this.fanfic.banPairing();
        });
        this.restorePairingBtn = addButton(this.wrapper, "Вернуть пейринг", false, this, 'rgb(220, 220, 0)', function () {
            this.fanfic.restorePairing();
        });
        this.restorePairingBtn.style.display = "none";
    }

    restorePairing(){
        let tempPairings = getBannedPairings();
        if (tempPairings.includes(this.pairingUri)) {
            tempPairings.splice(tempPairings.indexOf(this.pairingUri), 1);
            setBannedPairings(tempPairings);
            console.warn('restore pairing ' + this.pairingUri);
        }
        globalFanfics.forEach(function (fanfic) {
            fanfic.unHideFanfic();
        })
    }

    banPairing() {
        console.warn('hide pairing ' + this.pairingUri);
        let bannedPairings = getBannedPairings();
        bannedPairings.push(this.pairingUri);
        setBannedPairings(bannedPairings);
        globalFanfics.forEach(function (fanfic) {
            fanfic.hideFanfic();
        });
    }

    pairingBanned() {
        return getBannedPairings().includes(this.pairingUri);
    }

    hide(){
        let disliked_parameter_link = " disliked-parameter-link";
        let pairing_highlight = " pairing-highlight";

        if (this.pairingBanned())
        {
            if (!this.pairing.className.includes(disliked_parameter_link))
            {
                this.pairing.className += disliked_parameter_link;
            }
            if (this.pairing.className.includes(pairing_highlight))
            {
                this.pairing.className = this.pairing.className.replace(pairing_highlight, "");
            }
            this.restorePairingBtn.style.display = "";
            this.pairingBtn.style.display = "none";
        }
    }

    unHide(){
        let disliked_parameter_link = " disliked-parameter-link";
        let pairing_highlight = " pairing-highlight";
        if (!this.pairingBanned())
        {
            this.pairing.className = this.pairing.className.replace(disliked_parameter_link, "");
            if (!this.pairing.className.includes(pairing_highlight))
            {
                this.pairing.className += pairing_highlight;
            }
            this.restorePairingBtn.style.display = "none";
            this.pairingBtn.style.display = "";
        }
    }
}

class Fanfic {
    constructor(article) {
        this.title = article.querySelector("a.visit-link");
        this.author = article.querySelector("div.description ul.listing.list-inline li");
        this.authorLink = this.author.querySelector("a");
        this.authorId = parseInt(this.authorLink.href.match(/\/(\d+)+/)[1], 10);
        this.fanficId = parseInt(this.title.href.match(/\/(\d+)+/)[1], 10);
        this.direction = article.querySelector("span.direction");
        this.directionName = this.direction.className.replace("direction direction-before-", "");
        this.article = article;

        this.fandoms = Array.from(article.querySelector("dl.info dd").querySelectorAll("a")).map(function (fandom) {
            return new FanficFandom(this, fandom);
        }, this);

        this.pairings = Array.from(article.querySelectorAll("dl.info a.pairing-link")).map(function (pairing) {
            return new FanficPairing(this, pairing);
        }, this);

        this.fanficBtn = addButton(this.title.parentElement, 'Забанить фанфик', true, this, 'rgb(180, 0, 0)', function () {
            this.fanfic.banFanfic();
        });
        this.authorBtn = addButton(this.author, 'Забанить автора', false, this, 'rgb(180, 0, 0)', function () {
            this.fanfic.banAuthor();
        });
        this.directionBtn = addButton(this.direction, 'Забанить тип фанфиков', false, this, 'rgb(180, 0, 0)', function () {
            this.fanfic.banDirection();
        });
        this.restoreFanficBtn = addButton(this.title.parentElement, "Вернуть фанфик", true, this, 'rgb(220, 220, 0)', function () {
            this.fanfic.restoreFanfic();
        });
        this.restoreAuthorBtn = addButton(this.author, "Вернуть автора", false, this, 'rgb(220, 220, 0)', function () {
            this.fanfic.restoreAuthor();
        });
        this.restoreDirectionBtn = addButton(this.direction, "Вернуть тип фанфиков", false, this, 'rgb(220, 220, 0)', function () {
            this.fanfic.restoreDirection();
        });

        this.restoreFanficBtn.style.display = "none";
        this.restoreAuthorBtn.style.display = "none";
        this.restoreDirectionBtn.style.display = "none";
    }

    restoreFanfic() {
        let tempFanfics = getBannedFanfics();
        if (tempFanfics.includes(this.fanficId)) {
            tempFanfics.splice(tempFanfics.indexOf(this.fanficId), 1);
            setBannedFanfics(tempFanfics);
            console.warn('restore fanfic ' + this.fanficId);
        }
        this.unHideFanfic();
    }

    restoreAuthor(){
        let tempAuthors = getBannedAuthors();
        if (tempAuthors.includes(this.authorId)) {
            tempAuthors.splice(tempAuthors.indexOf(this.authorId), 1);
            setBannedAuthors(tempAuthors);
            console.warn('restore author ' + this.authorId);
        }
        globalFanfics.forEach(function (fanfic) {
            if (!fanfic.getFanficBanned())
                fanfic.unHideFanfic();
        })
    }

    restoreDirection(){
        let tempDirections = getBannedDirections();
        if (tempDirections.includes(this.directionName)) {
            tempDirections.splice(tempDirections.indexOf(this.directionName), 1);
            setBannedDirections(tempDirections);
            console.warn('restore direction ' + this.directionName);
        }
        globalFanfics.forEach(function (fanfic) {
            if (!fanfic.getFanficBanned())
                fanfic.unHideFanfic();
        })
    }

    banAuthor() {
        console.warn('hide author ' + this.authorId);
        let bannedAuthors = getBannedAuthors();
        bannedAuthors.push(this.authorId);
        setBannedAuthors(bannedAuthors);
        globalFanfics.forEach(function (fanfic) {
            if (fanfic.getFanficBanned())
                fanfic.hideFanfic();
        });
    }

    banFanfic() {
        console.warn('hide fanfic ' + this.fanficId);
        let bannedFanfics = getBannedFanfics();
        bannedFanfics.push(this.fanficId);
        setBannedFanfics(bannedFanfics);
        this.hideFanfic();
    }

    banDirection() {
        console.warn('hide direction ' + this.directionName);
        let bannedDirections = getBannedDirections();
        bannedDirections.push(this.directionName);
        setBannedDirections(bannedDirections);
        globalFanfics.forEach(function (fanfic) {
            if (fanfic.getFanficBanned())
                fanfic.hideFanfic();
        });
    }

    hideFanfic() {
        let fanfic_block_disliked = " fanfic-block-disliked";
        let disliked_parameter_link = " disliked-parameter-link";

        if (this.getFanficBanned())
        {
            if (!this.article.className.includes(fanfic_block_disliked))
            {
                this.article.className += fanfic_block_disliked;
            }
        }
        if (this.authorBanned())
        {
            if (!this.authorLink.className.includes(disliked_parameter_link))
            {
                this.authorLink.className += disliked_parameter_link;
            }
            this.restoreAuthorBtn.style.display = "";
            this.authorBtn.style.display = "none";
        }
        if (this.fanficBanned())
        {
            if (!this.title.className.includes(disliked_parameter_link))
            {
                this.title.className += disliked_parameter_link;
            }
            this.restoreFanficBtn.style.display = "";
            this.fanficBtn.style.display = "none";
        }
        if (this.directionBanned())
        {
            this.restoreDirectionBtn.style.display = "";
            this.directionBtn.style.display = "none";
        }
        this.fandoms.forEach(function (fandom) {
            fandom.hide();
        });
        this.pairings.forEach(function (pairing) {
            pairing.hide();
        });

        // TODO: fics can be hiden
        // $thumb.parent().parent().hide()
    }

    unHideFanfic() {
        let fanfic_block_disliked = " fanfic-block-disliked";
        let disliked_parameter_link = " disliked-parameter-link";

        if (!this.getFanficBanned())
        {
            this.article.className = this.article.className.replace(fanfic_block_disliked, "");
        }
        if (!this.authorBanned())
        {
            this.authorLink.className = this.authorLink.className.replace(disliked_parameter_link, "");
            this.restoreAuthorBtn.style.display = "none";
            this.authorBtn.style.display = "";
        }
        if (!this.fanficBanned())
        {
            this.title.className = this.title.className.replace(disliked_parameter_link, "");
            this.restoreFanficBtn.style.display = "none";
            this.fanficBtn.style.display = "";
        }
        if (!this.directionBanned())
        {
            this.restoreDirectionBtn.style.display = "none";
            this.directionBtn.style.display = "";
        }
        this.fandoms.forEach(function (fandom) {
            fandom.unHide();
        });
        this.pairings.forEach(function (pairing) {
            pairing.unHide();
        });


        // TODO: fics can be hiden
        // $thumb.parent().parent().hide()
    }

    getFanficBanned() {
        return this.fanficBanned()
            || this.authorBanned()
            || this.directionBanned()
            || this.anyFandomBanned()
            || this.anyPairingBanned();
    }

    directionBanned() {
        return getBannedDirections().includes(this.directionName);
    }

    authorBanned() {
        return getBannedAuthors().includes(this.authorId);
    }

    fanficBanned() {
        return getBannedFanfics().includes(this.fanficId);
    }

    anyFandomBanned(){
        return this.fandoms.some(function (fandom) {
            return fandom.fandomBanned();
        });
    }

    anyPairingBanned(){
        return this.pairings.some(function (pairing) {
            return pairing.pairingBanned();
        });
    }
}


(function () {
    // Hide fanfics
    $('article.block').each(function () {
        let fanfic = new Fanfic(this);
        globalFanfics.add(fanfic);
        if (fanfic.getFanficBanned())
            fanfic.hideFanfic();
    });
})();
console.log("Ficbook filter " + GM_info.script.version + " loaded.");
