// ==UserScript==
// @name        tree view for qwerty
// @name:ja     くわツリービュー
// @namespace   strangeworld
// @description It adds various features to strangeworld@misao.
// @description:ja あやしいわーるど＠みさおの投稿をツリーで表示できます。スタック表示の方にもいくつか機能を追加できます。
// @match       *://misao.mixh.jp/cgi-bin/bbs.cgi*
// @match       *://misao.biz/cgi-bin/bbs.cgi*
// @match       *://usamin.elpod.org/cgi-bin/swlog.cgi?b=*&s=*
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @grant       GM_listValues
// @grant       GM.listValues
// @grant       GM_openInTab
// @grant       GM.openInTab
// @grant       window.close
// @version     11.8
// @run-at      document-start
// @require     https://unpkg.com/nano-jsx/bundles/nano.slim.min.js
// @require     https://cdn.jsdelivr.net/npm/zustand@4/umd/vanilla.development.js
// @downloadURL https://update.greasyfork.org/scripts/1971/tree%20view%20for%20qwerty.user.js
// @updateURL https://update.greasyfork.org/scripts/1971/tree%20view%20for%20qwerty.meta.js
// ==/UserScript==
(function (index_js, vanilla) {
	'use strict';

	let IS_GM = typeof GM_setValue === "function";
	let IS_GM4 = typeof GM !== "undefined";
	let IS_EXTENSION = !IS_GM && !IS_GM4;
	let IS_USAMIN = location.hostname === "usamin.elpod.org" || location.protocol === "file:" && /usamin/.test(location.pathname);
	const isGm = ()=>IS_GM;
	const isGm4 = ()=>IS_GM4;
	const isExtension = ()=>IS_EXTENSION;
	const isUsamin = ()=>IS_USAMIN;

	class NG {
	    get isEnabled() {
	        return !!(this.words.length || this.handle);
	    }
	    get message() {
	        let isInvalid = "";
	        if (this.handle === null) {
	            isInvalid += "NGワード(ハンドル)が不正です。";
	        }
	        if (this.errors.length) {
	            isInvalid += "NGワード(本文)の一部が不正です。";
	        }
	        return isInvalid;
	    }
	    /**
		 * @param {RegExp[]} regexps
		 * @param {string} string
		 */ mark(regexps, string) {
	        return regexps.map((r)=>new RegExp(r, "g" + r.flags)).reduce((result, reg)=>result.replace(reg, "<mark class='NGWordHighlight'>$&</mark>"), string);
	    }
	    /**
		 * @param {string} string
		 */ markWord(string) {
	        return this.mark(this.words, string);
	    }
	    /**
		 * @param {string} string
		 */ markHandle(string) {
	        return this.handle ? this.mark([
	            this.handle
	        ], string) : string;
	    }
	    /**
		 * @param {string} string
		 */ testWord(string) {
	        return this.words.some((r)=>r.test(string));
	    }
	    /**
		 * @param {string} string
		 */ testHandle(string) {
	        var _this_handle;
	        return (_this_handle = this.handle) == null ? void 0 : _this_handle.test(string);
	    }
	    /**
		 * @param {Partial<Pick<import("./Config").default,"useNG"|"NGHandle"|"NGWord">>} config
		 */ constructor(config){
	        /** @type {RegExp[]} */ this.words = [];
	        this.handle = undefined;
	        this.errors = [];
	        if (!config.useNG) {
	            return;
	        }
	        if (config.NGHandle) {
	            try {
	                this.handle = new RegExp(config.NGHandle);
	            } catch (e) {
	                this.handle = null;
	            }
	        }
	        if (config.NGWord) {
	            this.words = config.NGWord.split("\n").filter((line)=>!line.startsWith("#") && line.trim() !== "").flatMap((/** @type {string} */ line)=>{
	                try {
	                    if (line.startsWith("/")) {
	                        const matches = /^\/(.*)\/(\w*)$/u.exec(line);
	                        if (matches) {
	                            const source = matches[1];
	                            const flags = Array.from(matches[2]).filter((l)=>![
	                                    "g",
	                                    "u"
	                                ].includes(l)).join("");
	                            return [
	                                new RegExp(source, flags + "u")
	                            ];
	                        } else {
	                            throw new Error("終わりの/がない");
	                        }
	                    } else {
	                        return [
	                            new RegExp(line)
	                        ];
	                    }
	                } catch (e) {
	                    this.errors.push({
	                        pattern: line,
	                        message: e.message
	                    });
	                }
	                return [];
	            });
	        }
	    }
	}

	const nullAnchor = document.createElement("a");
	Object.defineProperties(nullAnchor, {
	    outerHTML: {
	        value: ""
	    },
	    search: {
	        get () {
	            return "";
	        },
	        set () {}
	    }
	});

	const a = document.createElement("a");
	a.href = ">";
	let gt = a.outerHTML === '<a href=">"></a>';
	const replacer = (rel)=>(match)=>{
	        let href = match.replace(/"/g, "&quot;");
	        if (gt) {
	            href = href.replace(/&gt;/g, ">").replace(/&lt;/g, "<");
	        }
	        return `<a href="${href}" target="link" rel="${rel}">${match}</a>`;
	    };
	/**
	 * @param {string} url
	 */ function relinkify(url, rel = "noreferrer noopener") {
	    return url.replace(/(?:https?|ftp|gopher|telnet|whois|news):\/\/[\x21-\x7e]+/gi, replacer(rel));
	}

	class Post {
	    /**
		 * @param {Post} l
		 * @param {Post} r
		 */ static byID(l, r) {
	        return +l.id - +r.id;
	    }
	    /**
		 * @param {import("NG").default} ng
		 * @param {Pick<Post, "text" | "name" | "title" | "isNG">} post
		 */ static checkNG(ng, post) {
	        post.isNG = ng.testWord(post.text) || ng.testHandle(post.name) || ng.testHandle(post.title);
	    }
	    /**
		 * @param {import("NG").default} ng
		 */ checkNG(ng) {
	        Post.checkNG(ng, this);
	    }
	    /**
		 * @param {Post} post
		 * @returns {boolean}
		 */ static wantsParent(post) {
	        return !!post.parentId;
	    }
	    /**
		 * @param {Post} post
		 * @returns {boolean}
		 */ static isOrphan(post) {
	        return post.parent === null && !!post.parentId;
	    }
	    /**
		 * @param {Post} post
		 */ static mayHaveParent(post) {
	        return post.mayHaveParent();
	    }
	    /**
		 * この投稿と二世代前まで個別非表示がない。
		 * @param {Post} post
		 */ static isClean(post) {
	        var _post_parent, _post_parent_parent, _post_parent1;
	        return !(post.isVanished || ((_post_parent = post.parent) == null ? void 0 : _post_parent.isVanished) || ((_post_parent1 = post.parent) == null ? void 0 : (_post_parent_parent = _post_parent1.parent) == null ? void 0 : _post_parent_parent.isVanished));
	    }
	    isOP() {
	        return this.id === this.threadId;
	    }
	    getText() {
	        if (this.hasDefaultReference()) {
	            return this.text.slice(0, this.text.lastIndexOf("\n\n")) //参考と空行を除去
	            ;
	        }
	        return this.text;
	    }
	    hasDefaultReference() {
	        const parent = this.parent;
	        if (!parent) {
	            return false;
	        }
	        if (parent.date === this.parentDate) {
	            return true;
	        }
	        // usaminは、ヘッダの日時の表示の仕方が違う
	        if (isUsamin()) {
	            const [_, year, month, day, dow, hour, minute, second] = /^(\d+)\/(\d+)\/(\d+) \(([月火水木金土日])\) (\d+):(\d+):(\d+)$/.exec(parent.date) || [];
	            return this.parentDate === `${year}/${month}/${day}(${dow})${hour}時${minute}分${second}秒`;
	        } else {
	            return false;
	        }
	    }
	    /**
		 * `> > grandparent\n> parent\n\ntext\n\n<a>参照</a>`
		 * が
		 * `> > parent\n> text\n`になる。最後の改行は1つ
		 * @returns この`Post`が引用されたとき、こうなる
		 */ computeQuotedText() {
	        let lines = this.text // ＠みさおは^がついているようだ
	        .replace(/^&gt; &gt;.*\n/gm, "") // target属性がないのは参考リンクのみ
	        // ReDoS '<A HREF=">">参考：'.repeat(14143)
	        // .replace(/<a href="[^"]+">参考：.*<\/a>/i, "")
	        .replace(/^<a href="[^"]+">参考：.+$/im, "") // <A href=¥S+ target=¥"link¥">(¥S+)<¥/A>
	        .replace(/<a href="[^"]+" target="link"(?: rel="([^"]*)")?>([^<]+)<\/a>/gi, this.relinkify).replace(/\n/g, "\n&gt; ");
	        lines = ("&gt; " + lines + "\n").replace(/\n&gt;[ \n\r\f\t]+\n/g, "\n").replace(/\n&gt;[ \n\r\f\t]+\n$/, "\n");
	        return lines;
	    }
	    /**
		 * @param {any} _
		 * @param {string} rel
		 * @param {string} url
		 */ relinkify(_, rel, url) {
	        return relinkify(url, rel);
	    }
	    get textCandidate() {
	        const text = this.text.replace(/^&gt; (.*\n?)|^.*\n?/gm, "$1").replace(/\n$/, "").replace(/^[ \n\r\f\t]*$/gm, "$&\n$&");
	        //TODO 引用と本文の間に一行開ける
	        //text = text.replace(/((?:&gt; .*\n)+)(.+)/, "$1\n$2"); //replace(/^(?!&gt; )/m, "\n$&");
	        return text // + "\n\n";
	        ;
	    }
	    get textScore() {
	        return this.getText().replace(/^&gt; .*$\n?/gm, "").trim() !== "" ? 2 : 1;
	    }
	    get dateCandidate() {
	        return this.parentDate;
	    }
	    get dateScore() {
	        return /^\d{4}\/\d{2}\/\d{2}\(.\)\d{2}時\d{2}分\d{2}秒$/.test(this.parentDate) ? 100 : 0;
	    }
	    hasQuote() {
	        return /^&gt; /m.test(this.text);
	    }
	    mayHaveParent() {
	        return this.isRead && !this.isOP() && this.hasQuote();
	    }
	    get nameCandidate() {
	        return this.title.startsWith("＞") ? this.title.slice(1) : Post.prototype.name;
	    }
	    /**
		 * @returns {number} >= 0
		 */ get nameScore() {
	        return this.title.startsWith("＞") ? 1 : 0;
	    }
	    /**
		 * @param {Post} childToBeAdopted
		 */ adoptAsEldestChild(childToBeAdopted) {
	        if (this.child === childToBeAdopted) {
	            return;
	        }
	        childToBeAdopted.next = this.child;
	        childToBeAdopted.parent = this;
	        childToBeAdopted.isRoot = false;
	        this.child = childToBeAdopted;
	    }
	    getKeyForOwnParent() {
	        return this.parentId;
	    }
	    /**
		 * @returns {Post}
		 * @abstract
		 */ makeParent() {
	        throw new Error("Should not be called");
	    }
	    /**
		 * @param {string[]} vanishedMessageIDs
		 */ setVanishedForRoot(vanishedMessageIDs) {
	        this.setVanishedRecursive(vanishedMessageIDs);
	        if (!this.isVanished) {
	            this.setAscendantsVanished(vanishedMessageIDs);
	        }
	    }
	    /**
		 * @param {string[]} vanishedMessageIDs
		 */ setVanished(vanishedMessageIDs) {
	        this.isVanished = vanishedMessageIDs.includes(this.id);
	    }
	    /**
		 * @param {string[]} vanishedMessageIDs
		 */ setAscendantsVanished(vanishedMessageIDs) {
	        this.setParentVanished(vanishedMessageIDs);
	        if (!this.parent || this.parent.isVanished) {
	            return;
	        }
	        this.parent.setParentVanished(vanishedMessageIDs);
	    }
	    /**
		 * @param {string[]} vanishedMessageIDs
		 */ setParentVanished(vanishedMessageIDs) {
	        if (!this.parent) {
	            const parentId = this.postParent.get(this.id);
	            if (!parentId) {
	                return;
	            }
	            this.parent = new Post(parentId, this.postParent);
	        }
	        this.parent.setVanished(vanishedMessageIDs);
	    }
	    /**
		 * @param {string[]} vanishedMessageIDs
		 */ setVanishedRecursive(vanishedMessageIDs) {
	        var _this_child, _this_next;
	        this.setVanished(vanishedMessageIDs);
	        (_this_child = this.child) == null ? void 0 : _this_child.setVanishedRecursive(vanishedMessageIDs);
	        (_this_next = this.next) == null ? void 0 : _this_next.setVanishedRecursive(vanishedMessageIDs);
	    }
	    drop() {
	        if (this.child) {
	            this.child = this.child.drop();
	        }
	        if (this.next) {
	            this.next = this.next.drop();
	        }
	        if (Post.isClean(this) && (!this.isRead || this.child)) {
	            return this;
	        } else if (this.child && !this.child.isVanished) {
	            this.child.isRoot = true;
	        }
	        this.isRoot = false;
	        return this.next;
	    }
	    appendFfToButtons() {
	        const [year, month, day] = this.date.match(/\d+/g) || [];
	        if (year && month && day) {
	            for (const target of [
	                "threadButton",
	                "resButton",
	                "posterButton"
	            ]){
	                const search = this[target].search;
	                if (!/&ff=/.test(search)) {
	                    this[target].search = search.replace(/\b&c=[\dA-Fa-f]*/, `$&&ff=${year}${month}${day}.dat`);
	                }
	            }
	        }
	    }
	    get children() {
	        const result = [];
	        let last = this.child;
	        while(last){
	            result.push(last);
	            last = last.next;
	        }
	        return result;
	    }
	    getUniqueID() {
	        var _this_child;
	        return `${this.threadId}+${this.id}+${(_this_child = this.child) == null ? void 0 : _this_child.id}`;
	    }
	    cloneResButton() {
	        return /** @type {HTMLAnchorElement} */ this.resButton.cloneNode(true);
	    }
	    cloneThreadButton() {
	        return /** @type {HTMLAnchorElement} */ this.threadButton.cloneNode(true);
	    }
	    clonePosterButton() {
	        return /** @type {HTMLAnchorElement} */ this.posterButton.cloneNode(true);
	    }
	    /**
		 * @param {string} id
		 * @param {import("postParent/PostParent").default} postParent
		 */ constructor(id, postParent){
	        this.id = id;
	        this.postParent = postParent;
	        /** @type {Post} */ this.parent = null;
	        /** @type {Post} */ this.child = null;
	        /** @type {Post} */ this.next = null;
	        /** @type {boolean} */ this.isNG = null;
	    }
	}
	Post.prototype.id = "";
	Post.prototype.title = " ";
	Post.prototype.name = "　";
	Post.prototype.date = "";
	Post.prototype.resButton = nullAnchor;
	Post.prototype.posterButton = nullAnchor;
	Post.prototype.threadButton = nullAnchor;
	/**
	 * 投稿者が自由に設定できる。
	 * 数字以外も受け付けないと行けない。
	 */ Post.prototype.threadId = "";
	/** うさみんの、どの掲示板からの投稿かを示すもの [misao] */ Post.prototype.site = "";
	/** うさみん特有のボタン */ Post.prototype.usaminButtons = "";
	/**
	 * 親のid。string: 自然数の文字列。null: 親なし。undefined: 不明。
	 * @type {undefined|?string}
	 */ Post.prototype.parentId = null;
	Post.prototype.parentDate = "";
	Post.prototype.text = "";
	Post.prototype.env = null;
	Post.prototype.isVanished = false;
	Post.prototype.isRead = false;
	Post.prototype.parent = null;
	Post.prototype.child = null;
	Post.prototype.next = null;
	Post.prototype.isRoot = true;

	class ImaginaryPostPrototype extends Post {
	    /**
		 * @param {Post} child
		 */ setFields(child) {
	        this.threadId = child.threadId;
	        this.threadButton = child.threadButton;
	        this.parentId = this.isOP() ? null : this.postParent.get(this.id);
	        if (this.id) {
	            this.setResButton(child);
	        }
	    }
	    /**
		 * @param {Post} child
		 */ setResButton(child) {
	        const resButton = child.cloneResButton();
	        resButton.search = resButton.search.replace(/&s=\d+/, "&s=" + this.id);
	        this.resButton = resButton;
	    }
	    getText() {
	        return this.text;
	    }
	    getKeyForOwnParent() {
	        return this.parentId ? this.parentId : "parent of " + this.id;
	    }
	    // @ts-ignore
	    get text() {
	        return this.calculate("text");
	    }
	    // @ts-ignore
	    get date() {
	        return this.calculate("date");
	    }
	    // @ts-ignore
	    get name() {
	        return this.calculate("name");
	    }
	    /**
		 * @param {string} property
		 */ calculate(property) {
	        const candidates = this.collectCandidates(property);
	        const value = this.pickMostAppropriateCandidate(candidates);
	        return Object.defineProperty(this, property, {
	            value
	        })[property];
	    }
	    /**
		 * @param {string} property
		 */ collectCandidates(property) {
	        const ranks = Object.create(null);
	        let child = this.child;
	        while(child){
	            const candidate = child[`${property}Candidate`];
	            if (ranks[candidate] === undefined) {
	                ranks[candidate] = 1;
	            }
	            ranks[candidate] += child[`${property}Score`];
	            child = child.next;
	        }
	        return ranks;
	    }
	    /**
		 * @param {{[key: string]: number}} ranks
		 */ pickMostAppropriateCandidate(ranks) {
	        let winner;
	        let max = 0;
	        for(const candidate in ranks){
	            const rank = ranks[candidate];
	            if (max < rank) {
	                max = rank;
	                winner = candidate;
	            }
	        }
	        return winner;
	    }
	    /**
		 * @param {Post} child
		 */ constructor(child){
	        super(child.parentId, child.postParent);
	        this.setFields(child);
	        this.adoptAsEldestChild(child);
	    }
	}
	ImaginaryPostPrototype.prototype.isRead = true;

	class GhostPost extends ImaginaryPostPrototype {
	    async retrieveIdForcibly() {
	        return this.postParent.findAsync(this.child);
	    }
	}

	class MergedPost extends ImaginaryPostPrototype {
	    makeParent() {
	        return new GhostPost(this);
	    }
	}
	MergedPost.prototype.parentDate = "？";

	class ActualPost extends Post {
	    makeParent() {
	        return new MergedPost(this);
	    }
	}

	/**
	 * @param {"nextSibling"|"nextElementSibling"} type - トラバースの仕方
	 * @returns {(nodeName: string) => (node: Node) => ?Node}
	 */ const next = (type)=>(nodeName)=>(node)=>{
	            while(node = node[type]){
	                if (node.nodeName === nodeName) {
	                    return node;
	                }
	            }
	        };
	const nextElement = /** @type {function(string): function(HTMLElement): HTMLElement} */ next("nextElementSibling");
	const nextFont = /** @type {function(Node): ?HTMLFontElement} */ nextElement("FONT");
	const nextB = /** @type {function(Node): ?HTMLElement} */ nextElement("B");
	const nextBlockquote = /** @type {function(Node): ?HTMLQuoteElement} */ nextElement("BLOCKQUOTE");

	/** @param {HTMLAnchorElement} anchor */ function collectEssentialElements(anchor) {
	    const header = nextFont(anchor);
	    const title = /** @type {HTMLElement} */ header.firstChild;
	    const name = nextB(header);
	    const info = nextFont(name);
	    const date = /** @type {Text} */ info.firstChild;
	    // レスボタン
	    const resButton = /** @type {HTMLAnchorElement} */ info.firstElementChild;
	    let posterButton;
	    let threadButton;
	    let nextButton = /** @type {?HTMLAnchorElement} */ resButton.nextElementSibling;
	    // 投稿者検索ボタン？
	    if (nextButton && nextButton.search && nextButton.search.startsWith("?m=s")) {
	        posterButton = /** @type {HTMLAnchorElement} */ nextButton;
	        nextButton = /** @type {?HTMLAnchorElement} */ nextButton.nextElementSibling;
	    }
	    // スレッドボタン？
	    if (nextButton) {
	        threadButton = /** @type {HTMLAnchorElement} */ nextButton;
	    }
	    const blockquote = nextBlockquote(info);
	    const pre = /** @type {HTMLPreElement} */ blockquote.firstElementChild;
	    return {
	        anchor,
	        title,
	        name,
	        date,
	        resButton,
	        posterButton,
	        threadButton,
	        blockquote,
	        pre
	    };
	}

	/**
	 * 新しいのが先
	 * @param {ParentNode} context
	 * @param {import("postParent/PostParent").default} postParent
	 */ function makePosts(context, postParent) {
	    const posts = isUsamin() ? makePostsUsamin(context, postParent) : makePostsKuzuha(context, postParent);
	    sortByTime(posts);
	    return posts;
	}
	/**
	 * @param {ParentNode} context
	 * @param {import("postParent/PostParent").default} postParent
	 * @returns {ActualPost[]}
	 */ const makePostsKuzuha = function(context, postParent) {
	    /** @type {ActualPost[]}	 */ const posts = [];
	    /** @type {NodeListOf<HTMLAnchorElement>}	 */ const as = context.querySelectorAll("a[name]");
	    for(let i = 0, len = as.length; i < len; i++){
	        const a = as[i];
	        const el = collectEssentialElements(a);
	        const post = new ActualPost(a.name, postParent) // NOSONAR
	        ;
	        posts.push(post);
	        post.title = el.title.innerHTML;
	        post.name = el.name.innerHTML;
	        post.date = el.date.nodeValue.trim().slice(4) //「投稿日：」削除
	        ;
	        post.resButton = el.resButton;
	        if (el.posterButton) {
	            post.posterButton = el.posterButton;
	        }
	        if (el.threadButton) {
	            post.threadButton = /** @type {HTMLAnchorElement} */ el.threadButton.cloneNode(true);
	            post.threadId = /&s=([^&]+)/.exec(post.threadButton.search)[1];
	        } else {
	            const id = post.id;
	            const threadButton = /** @type {HTMLAnchorElement} */ el.resButton.cloneNode(true);
	            threadButton.search = threadButton.search.replace(/^\?m=f/, "?m=t").replace(/&[dpu]=[^&]*/g, "").replace(/(&s=)\d+/, `$1${id}`);
	            threadButton.text = "◆";
	            post.threadButton = threadButton;
	            post.threadId = id;
	        }
	        const env = nextFont(el.pre);
	        if (env) {
	            post.env = /** @type {HTMLElement} */ env.firstChild.innerHTML // font > i > env
	            ;
	        }
	        const { text, parentId, parentDate } = breakdownPre(el.pre.innerHTML, post.id);
	        post.text = text;
	        if (parentId) {
	            post.parentId = parentId;
	            post.parentDate = parentDate;
	        }
	    }
	    return posts;
	};
	/**
	 * @param {ParentNode} context
	 * @param {import("postParent/PostParent").default} postParent
	 * @returns {ActualPost[]}
	 */ const makePostsUsamin = function(context, postParent) {
	    const as = context.querySelectorAll("a[id]");
	    const nextPre = nextElement("PRE");
	    const nextFontOrB = (node)=>{
	        while(node = node.nextElementSibling){
	            const name = node.nodeName;
	            if (name === "FONT" || name === "B") {
	                return node;
	            }
	        }
	    };
	    return Array.prototype.map.call(as, (a)=>{
	        const post = new ActualPost(a.id, postParent);
	        let header = nextFontOrB(a);
	        if (header.size === "+1") {
	            post.title = header.firstChild.innerHTML;
	            header = nextFontOrB(header);
	        }
	        if (header.tagName === "B") {
	            post.name = header.innerHTML;
	            header = nextFontOrB(header);
	        }
	        /** @type {HTMLElement} */ const info = header;
	        post.date = info.firstChild.nodeValue.trim();
	        post.threadButton = /** @type {HTMLAnchorElement} */ info.firstElementChild;
	        post.usaminButtons = Array.from(info.children).map((node)=>node.outerHTML).join(" ");
	        post.site = info.lastChild.textContent;
	        const pre = nextPre(info);
	        const { text, parentId, parentDate } = breakdownPre(pre.innerHTML, post.id);
	        post.text = text;
	        if (parentId) {
	            post.parentId = parentId;
	            post.parentDate = parentDate;
	        }
	        return post;
	    });
	};
	/**
	 *
	 * @param {string} html
	 * @param {string} id
	 * @returns
	 */ const breakdownPre = function(html, id) {
	    let text = html.replace(/<\/?font[^>]*>/gi, "").replace(/\r\n?/g, "\n").replace(/\n$/, "");
	    if (text.includes("&lt;A")) {
	        text = text.replace(//chrome     &quot; &lt; &gt;
	        //firefox91  &quot; &lt; &gt;
	        //firefox56  &quot; <    >
	        //古いfirefox %22    %3C  %3E
	        /&lt;A href="<a href="(.*)(?:&quot;|%22)"( target="link"(?: rel="noreferrer noopener")?)>\1"<\/a>\2&gt;<a href="\1(?:&lt;\/A&gt;|<\/A>|%3C\/A%3E)"\2>\1&lt;\/A&gt;<\/a>/g, '<a href="$1" target="link">$1</a>');
	    }
	    let candidate = text;
	    let parentId;
	    let parentDate;
	    const reference = /\n\n<a href="([^"]+)">参考：([^<]+)<\/a>$/.exec(text);
	    if (reference) {
	        var _exec, _exec1;
	        parentId = ((_exec = /\bs=([1-9]\d*)\b/.exec(reference[1])) == null ? void 0 : _exec[1]) || ((_exec1 = /^#([1-9]\d*)$/.exec(reference[1])) == null ? void 0 : _exec1[1]);
	        parentDate = reference[2];
	        if (+id <= +parentId) {
	            parentId = null;
	        }
	        text = text.slice(0, reference.index);
	    }
	    // リンク欄を使ったリンクを落とす
	    const autolink = /\n\n<[^<]+<\/a>$/.exec(text);
	    if (autolink) {
	        text = text.slice(0, autolink.index);
	    }
	    // 自動リンクがオフかつURLみたいのがあったら
	    if (!text.includes("<") && text.includes(":")) {
	        var _autolink_, _reference_;
	        // 自動リンクする
	        candidate = relinkify(text) + ((_autolink_ = autolink == null ? void 0 : autolink[0]) != null ? _autolink_ : "") + ((_reference_ = reference == null ? void 0 : reference[0]) != null ? _reference_ : "");
	    }
	    candidate = candidate.replace(/target="link">/g, 'target="link" rel="noreferrer noopener">');
	    return {
	        text: candidate,
	        parentId,
	        parentDate
	    };
	};
	/**
	 * 新しいのが先
	 * @param {ActualPost[]} posts
	 */ const sortByTime = function(posts) {
	    if (posts.length >= 2 && +posts[0].id < +posts[1].id) {
	        posts.reverse();
	    }
	};

	function originalRange(container, range = document.createRange()) {
	    const firstAnchor = container.querySelector("a[name]");
	    if (!firstAnchor) {
	        return range;
	    }
	    const end = kuzuhaEnd(container);
	    if (!end) {
	        return range;
	    }
	    const start = startNode(container, firstAnchor);
	    range.setStartBefore(start);
	    range.setEndAfter(end);
	    return range;
	}
	function startNode(container, firstAnchor) {
	    const h1 = container.querySelector("h1");
	    if (h1 && h1.compareDocumentPosition(firstAnchor) & Node.DOCUMENT_POSITION_FOLLOWING) {
	        return h1;
	    } else {
	        return firstAnchor;
	    }
	}
	function kuzuhaEnd(container) {
	    let last = container.lastChild;
	    while(last){
	        const type = last.nodeType;
	        if (type === Node.COMMENT_NODE && last.nodeValue === " " || type === Node.ELEMENT_NODE && last.nodeName === "H3") {
	            return last;
	        }
	        last = last.previousSibling;
	    }
	    return null;
	}

	class Context {
	    /**
		 * @param {ParentNode} fragment
		 * @param {() => void} callback called before fetching posts from external resource
		 */ makePosts(fragment, callback) {
	        return this.collectPosts(fragment, callback);
	    }
	    /**
		 * @param {ParentNode} fragment
		 * @param {() => void} callback
		 * @returns {Promise<ActualPost[]>}
		 */ collectPosts(fragment, callback) {
	        return new Promise((resolve)=>{
	            const posts = makePosts(fragment, this.postParent);
	            if (this.q.shouldFetch()) {
	                callback();
	                const makePostsAndConcat = (/** @type {ActualPost[]} */ posts, { fragment })=>[
	                        ...posts,
	                        ...makePosts(fragment, this.postParent)
	                    ];
	                this.q.fetchOldLogs(fragment).then(({ afters, befores })=>[
	                        ...afters.reduce(makePostsAndConcat, []),
	                        ...posts,
	                        ...befores.reduce(makePostsAndConcat, [])
	                    ]).then(resolve);
	            } else {
	                resolve(posts);
	            }
	        }).then((posts)=>{
	            this.postParent.insert(posts);
	            const ng = new NG(this.config);
	            posts.forEach((post)=>{
	                post.checkNG(ng);
	            });
	            this.makeButtonsPointToOldLog(posts);
	            return posts;
	        });
	    }
	    /**
		 * @param {ActualPost[]} posts
		 */ makeButtonsPointToOldLog(posts) {
	        if (this.q.shouldAppendFf()) {
	            posts.forEach((post)=>{
	                post.appendFfToButtons();
	            });
	        }
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ suggestLink(fragment) {
	        return this.q.suggestLink(fragment);
	    }
	    getLogName() {
	        return this.q.getLogName();
	    }
	    /**
		 * `config.deleteOriginal` = true の場合はない振りをする
		 * @param {ParentNode} fragment
		 */ extractOriginalPostsAreaFrom(fragment) {
	        if (isUsamin()) {
	            return document.createDocumentFragment();
	        }
	        const range = originalRange(fragment);
	        if (this.config.deleteOriginal) {
	            range.deleteContents();
	            return document.createDocumentFragment();
	        } else {
	            return range.extractContents();
	        }
	    }
	    /**
		 * @param {import("./Config").default} config
		 * @param {import("Query").default} q
		 */ constructor(config, q, postParent){
	        this.config = config;
	        this.q = q;
	        this.postParent = postParent;
	    }
	}

	/**
	 * @template T
	 * @param {(arg: string) => T} fn
	 * @returns {(arg: string) => T}
	 */ function memoize(fn) {
	    const cache = {};
	    return (arg)=>{
	        if (!Object.prototype.hasOwnProperty.call(cache, arg)) {
	            cache[arg] = fn(arg);
	        }
	        return cache[arg];
	    };
	}

	/**
	 * @param {object} arg
	 * @param {"GET"|"PUT"|"HEAD"} [arg.type]
	 * @param {string} [arg.url]
	 * @param {object|string|URLSearchParams} [arg.data]
	 * @returns {Promise<DocumentFragment>}
	 */ function ajax({ type = "GET", url = location.href, data = {} }) {
	    const requestUrl = new URL(url);
	    const search = new URLSearchParams(data).toString();
	    if (type === "GET") {
	        requestUrl.search = search;
	    }
	    return new Promise(function(resolve, reject) {
	        const xhr = new XMLHttpRequest();
	        xhr.open(type, requestUrl);
	        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	        xhr.responseType = "document";
	        xhr.onload = function() {
	            if (xhr.status === 200) {
	                const range = document.createRange();
	                range.selectNodeContents(/** @type {Document} */ xhr.response.body);
	                resolve(range.extractContents());
	            } else {
	                reject(new Error(xhr.statusText));
	            }
	        };
	        xhr.onerror = function() {
	            reject(new Error("Network Error"));
	        };
	        xhr.send(search);
	    });
	}

	/**
	 * type のストレージが利用可能か
	 * @param {"localStorage"|"sessionStorage"} type
	 * @param {Window} win
	 * @returns
	 */ const storageIsAvailable = (type, win = window)=>{
	    // https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Feature-detecting_localStorage
	    try {
	        const storage = win[type];
	        const x = "__storage_test__";
	        storage.setItem(x, x);
	        storage.removeItem(x);
	        return true;
	    } catch (e) {
	        return false;
	    }
	};

	class InMemoryStorage {
	    setItem(k, v) {
	        this.data[k] = v;
	    }
	    getItem(k) {
	        const v = this.data[k];
	        return v != null ? v : null;
	    }
	    removeItem(k) {
	        delete this.data[k];
	    }
	    constructor(){
	        this.data = Object.create(null);
	    }
	}
	/**
	 * @param {import("Config").default} config
	 * @returns {{setItem: (k: string, v: string) => void; getItem: (k: string) => ?string; removeItem: (k: string) => void}}
	 */ const getStorage$1 = (config)=>{
	    if (isUsamin()) {
	        return new InMemoryStorage();
	    }
	    if (config.useVanishMessage && storageIsAvailable("localStorage")) {
	        return localStorage;
	    }
	    if (storageIsAvailable("sessionStorage")) {
	        return sessionStorage;
	    }
	    return new InMemoryStorage();
	};

	class PostParent {
	    /**
		 * @param {Post[]} posts
		 */ insert(posts) {
	        if (!posts.length) {
	            return;
	        }
	        this.load();
	        for (const { id, parentId } of posts){
	            if (Object.prototype.hasOwnProperty.call(this.data, id)) {
	                continue;
	            }
	            this.data[id] = parentId;
	            this.changed = true;
	        }
	        this.cleanUpAndSave();
	    }
	    load() {
	        if (!this.storage) {
	            this.storage = getStorage$1(this.config);
	        }
	        if (!this.data) {
	            this.data = JSON.parse(this.storage.getItem("postParent")) || {};
	        }
	    }
	    cleanUpAndSave() {
	        if (!this.changed) {
	            return;
	        }
	        let ids = Object.keys(this.data);
	        const limits = this.getLimits();
	        if (ids.length <= limits.upper) {
	            this.save(this.data);
	            return;
	        }
	        ids = ids.map((id)=>+id).sort((l, r)=>r - l).map((id)=>"" + id);
	        /** @type {IdMap} */ const saveData = Object.create(null);
	        let i = limits.lower;
	        while(i--){
	            saveData[ids[i]] = this.data[ids[i]];
	        }
	        this.save(saveData);
	    }
	    getLimits() {
	        const config = this.config;
	        if (!config.useVanishMessage) {
	            // 最新の投稿の親の親がこれくらいに収まる
	            return {
	                upper: 500,
	                lower: 300
	            };
	        }
	        if (config.vanishMessageAggressive) {
	            // 一日の投稿数の平均が3000件超えくらいだった
	            return {
	                upper: 3500,
	                lower: 3300
	            };
	        } else {
	            // 1000件目の親の親がこれくらいに収まる
	            return {
	                upper: 1500,
	                lower: 1300
	            };
	        }
	    // なぜ差が200なのかは覚えていない
	    }
	    /**
		 * @param {IdMap} data
		 */ save(data) {
	        console.error(this.data["3"]);
	        this.storage.setItem("postParent", JSON.stringify(data));
	    }
	    /**
		 * @public
		 * @param {string} id
		 * @returns {string=}
		 */ get(id) {
	        this.load();
	        return this.data[id];
	    }
	    /**
		 * 親のIDを返す
		 * @public
		 * @param {object} data
		 * @param {string} data.id 子のId
		 * @param {string} data.threadId 探索するスレッドのId
		 * @returns {Promise<string|undefined>}
		 */ findAsync({ id, threadId }) {
	        if (this.shouldFetch(id, threadId)) {
	            return this.updateThread(threadId).then(()=>this.get(id));
	        } else {
	            return Promise.resolve(this.get(id));
	        }
	    }
	    /**
		 * @param {string} childId
		 * @param {string} threadId
		 */ areValidIds(childId, threadId) {
	        return /^(?!0)\d+$/.test(threadId) && /^(?!0)\d+$/.test(childId) && +threadId <= +childId;
	    }
	    isPersistentStorage() {
	        return !(this.storage instanceof InMemoryStorage);
	    }
	    /**
		 * @param {string} childId
		 * @param {string} threadId
		 */ shouldFetch(childId, threadId) {
	        return typeof this.data[childId] === "undefined" && this.isPersistentStorage() && this.areValidIds(childId, threadId);
	    }
	    /**
		 * @param {string} threadId
		 */ updateThread(threadId) {
	        return ajax({
	            data: {
	                m: "t",
	                s: threadId
	            }
	        }).then((fragment)=>makePosts(fragment, this)).then(this.insert.bind(this));
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        this.config = config;
	        this.storage = null;
	        /** @type {IdMap} */ this.data = null;
	        this.updateThread = memoize(this.updateThread.bind(this));
	    }
	}

	class _class {
	    /**
		 * @param {Node} start
		 * @param {Node} end
		 */ extractContents(start, end) {
	        this.range.setStartBefore(start);
	        this.range.setEndAfter(end);
	        return this.range.extractContents();
	    }
	    /**
		 * @param {Node} start
		 * @param {Node} end
		 */ deleteContents(start, end) {
	        this.range.setStartBefore(start);
	        this.range.setEndAfter(end);
	        this.range.deleteContents();
	    }
	    /**
		 * @param {Node} wrapper
		 * @param {Node} start
		 * @param {Node} end
		 */ surroundContents(wrapper, start, end) {
	        this.range.setStartBefore(start);
	        this.range.setEndAfter(end);
	        this.range.surroundContents(wrapper);
	    }
	    /**
		 * @param {Node} node
		 */ selectNodeContents(node) {
	        this.range.selectNodeContents(node);
	    }
	    /**
		 * @param {string} html
		 */ createContextualFragment(html) {
	        return this.range.createContextualFragment(html);
	    }
	    constructor(range = document.createRange()){
	        this.range = range;
	    }
	}

	class StackPresenter {
	    setView(view) {
	        this.view = view;
	    }
	    removeVanishedThread(threadId) {
	        return this.config.removeVanishedThread(threadId);
	    }
	    addVanishedThread(threadId) {
	        return this.config.addVanishedThread(threadId);
	    }
	    /**
		 * @param {ParentNode} fragment `fragment`の先頭は通常は空白。ログの一番先頭のみ\<A>
		 */ render(fragment) {
	        this.view.render(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ finish(fragment) {
	        this.view.finishFooter(fragment);
	        return new Promise((resolve)=>{
	            if (this.shouldFetch()) {
	                this.complementThread().then(resolve);
	            } else {
	                resolve();
	            }
	        }).then(()=>this.view.finish());
	    }
	    shouldFetch() {
	        return this.q.shouldFetch();
	    }
	    complementThread() {
	        this.view.showIsSearchingOldLogsExceptFor(this.q.getLogName());
	        return this.q.fetchOldLogs(this.view.el).then(({ befores, afters })=>{
	            this.view.setBeforesAndAfters(this.q.getLogName(), befores, afters);
	            this.view.doneSearchingOldLogs();
	        });
	    }
	    /**
		 * @param {import("Config").default} config
		 * @param {import("../Query").default} q
		 */ constructor(config, q, range = new _class()){
	        this.config = config;
	        this.q = q;
	        this.range = range;
	        /** @type {import("./StackView").default} */ this.view = null;
	    }
	}

	const Fragment = (props) => {
	    return props.children;
	};

	const isSSR = () => typeof _nano !== 'undefined' && _nano.isSSR === true;
	/** Creates a new Microtask using Promise() */
	const tick = Promise.prototype.then.bind(Promise.resolve());
	// https://stackoverflow.com/a/7616484/12656855
	const strToHash = (s) => {
	    let hash = 0;
	    for (let i = 0; i < s.length; i++) {
	        const chr = s.charCodeAt(i);
	        hash = (hash << 5) - hash + chr;
	        hash |= 0; // Convert to 32bit integer
	    }
	    return Math.abs(hash).toString(32);
	};
	const appendChildren = (element, children, escape = true) => {
	    // if the child is an html element
	    if (!Array.isArray(children)) {
	        appendChildren(element, [children], escape);
	        return;
	    }
	    // htmlCollection to array
	    if (typeof children === 'object')
	        children = Array.prototype.slice.call(children);
	    children.forEach(child => {
	        // if child is an array of children, append them instead
	        if (Array.isArray(child))
	            appendChildren(element, child, escape);
	        else {
	            // render the component
	            const c = _render(child);
	            if (typeof c !== 'undefined') {
	                // if c is an array of children, append them instead
	                if (Array.isArray(c))
	                    appendChildren(element, c, escape);
	                // apply the component to parent element
	                else {
	                    if (isSSR() && !escape)
	                        element.appendChild(c.nodeType == null ? c.toString() : c);
	                    else
	                        element.appendChild(c.nodeType == null ? document.createTextNode(c.toString()) : c);
	                }
	            }
	        }
	    });
	};
	/**
	 * A simple component for rendering SVGs
	 */
	const SVG = (props) => {
	    const child = props.children[0];
	    const attrs = child.attributes;
	    if (isSSR())
	        return child;
	    const svg = hNS('svg');
	    for (let i = attrs.length - 1; i >= 0; i--) {
	        svg.setAttribute(attrs[i].name, attrs[i].value);
	    }
	    svg.innerHTML = child.innerHTML;
	    return svg;
	};
	const _render = (comp) => {
	    // null, false, undefined
	    if (comp === null || comp === false || typeof comp === 'undefined')
	        return [];
	    // string, number
	    if (typeof comp === 'string' || typeof comp === 'number')
	        return comp.toString();
	    // SVGElement
	    if (comp.tagName && comp.tagName.toLowerCase() === 'svg')
	        return SVG({ children: [comp] });
	    // HTMLElement
	    if (comp.tagName)
	        return comp;
	    // TEXTNode (Node.TEXT_NODE === 3)
	    if (comp && comp.nodeType === 3)
	        return comp;
	    // Class Component
	    if (comp && comp.component && comp.component.isClass)
	        return renderClassComponent(comp);
	    // Class Component (Uninitialized)
	    if (comp.isClass)
	        return renderClassComponent({ component: comp, props: {} });
	    // Functional Component
	    if (comp.component && typeof comp.component === 'function')
	        return renderFunctionalComponent(comp);
	    // Array (render each child and return the array) (is probably a fragment)
	    if (Array.isArray(comp))
	        return comp.map(c => _render(c)).flat();
	    // function
	    if (typeof comp === 'function' && !comp.isClass)
	        return _render(comp());
	    // if component is a HTMLElement (rare case)
	    if (comp.component && comp.component.tagName && typeof comp.component.tagName === 'string')
	        return _render(comp.component);
	    // (rare case)
	    if (Array.isArray(comp.component))
	        return _render(comp.component);
	    // (rare case)
	    if (comp.component)
	        return _render(comp.component);
	    // object
	    if (typeof comp === 'object')
	        return [];
	    console.warn('Something unexpected happened with:', comp);
	};
	const renderFunctionalComponent = (fncComp) => {
	    const { component, props } = fncComp;
	    return _render(component(props));
	};
	const renderClassComponent = (classComp) => {
	    const { component, props } = classComp;
	    // calc hash
	    const hash = strToHash(component.toString());
	    // make hash accessible in constructor, without passing it to it
	    component.prototype._getHash = () => hash;
	    const Component = new component(props);
	    if (!isSSR())
	        Component.willMount();
	    let el = Component.render();
	    el = _render(el);
	    Component.elements = el;
	    // pass the component instance as ref
	    if (props && props.ref)
	        props.ref(Component);
	    if (!isSSR())
	        tick(() => {
	            Component._didMount();
	        });
	    return el;
	};
	const hNS = (tag) => document.createElementNS('http://www.w3.org/2000/svg', tag);
	// https://stackoverflow.com/a/42405694/12656855
	const h = (tagNameOrComponent, props = {}, ...children) => {
	    // if children is passed as props, merge with ...children
	    if (props && props.children) {
	        if (Array.isArray(children)) {
	            if (Array.isArray(props.children))
	                children = [...props.children, ...children];
	            else
	                children.push(props.children);
	        }
	        else {
	            if (Array.isArray(props.children))
	                children = props.children;
	            else
	                children = [props.children];
	        }
	    }
	    // render WebComponent in SSR
	    if (isSSR() && _nano.ssrTricks.isWebComponent(tagNameOrComponent)) {
	        const element = _nano.ssrTricks.renderWebComponent(tagNameOrComponent, props, children, _render);
	        if (element === null)
	            return `ERROR: "<${tagNameOrComponent} />"`;
	        else
	            return element;
	    }
	    // if tagNameOrComponent is a component
	    if (typeof tagNameOrComponent !== 'string')
	        return { component: tagNameOrComponent, props: Object.assign(Object.assign({}, props), { children: children }) };
	    // custom message if document is not defined in SSR
	    try {
	        if (isSSR() && typeof tagNameOrComponent === 'string' && !document)
	            throw new Error('document is not defined');
	    }
	    catch (err) {
	        console.log('ERROR:', err.message, '\n > Please read: https://github.com/nanojsx/nano/issues/106');
	    }
	    let ref;
	    const element = tagNameOrComponent === 'svg'
	        ? hNS('svg')
	        : document.createElement(tagNameOrComponent);
	    // check if the element includes the event (for example 'oninput')
	    const isEvent = (el, p) => {
	        // check if the event begins with 'on'
	        if (0 !== p.indexOf('on'))
	            return false;
	        // we return true if SSR, since otherwise it will get rendered
	        if (el._ssr)
	            return true;
	        // check if the event is present in the element as object (null) or as function
	        return typeof el[p] === 'object' || typeof el[p] === 'function';
	    };
	    for (const p in props) {
	        // https://stackoverflow.com/a/45205645/12656855
	        // style object to style string
	        if (p === 'style' && typeof props[p] === 'object') {
	            const styles = Object.keys(props[p])
	                .map(k => `${k}:${props[p][k]}`)
	                .join(';')
	                .replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
	            props[p] = `${styles};`;
	        }
	        // handel ref
	        if (p === 'ref')
	            ref = props[p];
	        // handle events
	        else if (isEvent(element, p.toLowerCase()))
	            element.addEventListener(p.toLowerCase().substring(2), (e) => props[p](e));
	        // dangerouslySetInnerHTML
	        else if (p === 'dangerouslySetInnerHTML' && props[p].__html) {
	            if (!isSSR()) {
	                const fragment = document.createElement('fragment');
	                fragment.innerHTML = props[p].__html;
	                element.appendChild(fragment);
	            }
	            else {
	                element.innerHTML = props[p].__html;
	            }
	        }
	        // modern dangerouslySetInnerHTML
	        else if (p === 'innerHTML' && props[p].__dangerousHtml) {
	            if (!isSSR()) {
	                const fragment = document.createElement('fragment');
	                fragment.innerHTML = props[p].__dangerousHtml;
	                element.appendChild(fragment);
	            }
	            else {
	                element.innerHTML = props[p].__dangerousHtml;
	            }
	        }
	        // className
	        else if (/^className$/i.test(p))
	            element.setAttribute('class', props[p]);
	        // setAttribute
	        else if (typeof props[p] !== 'undefined')
	            element.setAttribute(p, props[p]);
	    }
	    // these tags should not be escaped by default (in ssr)
	    const escape = !['noscript', 'script', 'style'].includes(tagNameOrComponent);
	    appendChildren(element, children, escape);
	    if (ref)
	        ref(element);
	    return element;
	};

	var __rest = (window && window.__rest) || function (s, e) {
	    var t = {};
	    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
	        t[p] = s[p];
	    if (s != null && typeof Object.getOwnPropertySymbols === "function")
	        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
	            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
	                t[p[i]] = s[p[i]];
	        }
	    return t;
	};
	const createNode = function (type, props) {
	    let { children = [] } = props, _props = __rest(props, ["children"]);
	    if (!Array.isArray(children))
	        children = [children];
	    return h(type, _props, ...children);
	};

	function locationReload() {
	    window.location.reload();
	}

	function midokureload() {
	    /** @type {HTMLInputElement} */ const midoku = document.querySelector('#form input[name="midokureload"]');
	    if (midoku) {
	        midoku.click();
	    } else {
	        locationReload();
	    }
	}

	/**
	 * @param {string} href
	 */ function openInTab(href) {
	    if (typeof GM_openInTab === "function") {
	        GM_openInTab(href, false);
	    // GM4Storage.openInTabがない場合があるからこうなっているらしい
	    } else if (typeof GM === "object" && GM.openInTab) {
	        GM.openInTab(href, false);
	    } else {
	        window.open(href);
	    }
	}

	/**
	 * @param {import("Config").default} config
	 */ function KeyboardNavigation(config) {
	    const messages = document.getElementsByClassName("message");
	    let focusedIndex = -1;
	    let done = -1;
	    this.enableToReload = function() {
	        done = Date.now();
	    };
	    this.isValid = function(index) {
	        return !!messages[index];
	    };
	    // jQuery 2系 jQuery.expr.filters.visibleより
	    function isVisible(elem) {
	        return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
	    }
	    function isHidden(elem) {
	        return !isVisible(elem);
	    }
	    this.indexOfNextVisible = function(index, dir) {
	        const el = messages[index];
	        if (el && (isHidden(el) || el.classList.contains("invalid"))) {
	            return this.indexOfNextVisible(index + dir, dir);
	        }
	        return index;
	    };
	    let isUpdateScheduled = false;
	    this.updateIfNeeded = function() {
	        if (isUpdateScheduled) {
	            return;
	        }
	        isUpdateScheduled = true;
	        requestAnimationFrame(this.changeFocusedMessage);
	    };
	    this.changeFocusedMessage = function() {
	        const m = messages[focusedIndex];
	        const top = m.getBoundingClientRect().top;
	        const x = window.scrollX;
	        const y = window.scrollY;
	        window.scrollTo(x, top + y - +config.keyboardNavigationOffsetTop);
	        const focused = document.getElementsByClassName("focused")[0];
	        if (focused) {
	            focused.classList.remove("focused");
	        }
	        m.classList.add("focused");
	        isUpdateScheduled = false;
	    };
	    this.focus = function(dir) {
	        const index = this.indexOfNextVisible(focusedIndex + dir, dir);
	        if (this.isValid(index)) {
	            focusedIndex = index;
	            this.updateIfNeeded();
	        } else if (dir === 1) {
	            const now = Date.now();
	            if (done >= 0 && now - done >= 500) {
	                done = now;
	                midokureload();
	            }
	        }
	    };
	    this.res = function() {
	        const focused = document.querySelector(".focused");
	        if (!focused) {
	            return;
	        }
	        let selector;
	        if (focused.querySelector(".res")) {
	            selector = ".res";
	        } else {
	            selector = "font > a:first-child";
	        }
	        const res = /** @type {HTMLAnchorElement} */ focused.querySelector(selector);
	        if (res) {
	            openInTab(res.href);
	        }
	    };
	}
	KeyboardNavigation.prototype.handleEvent = function(/** @type {KeyboardEvent} */ e) {
	    const target = /** @type {HTMLElement} */ e.target;
	    if (/^(?:INPUT|SELECT|TEXTAREA)$/.test(target.nodeName) || target.isContentEditable) {
	        return;
	    }
	    switch(e.key){
	        case "j":
	            this.focus(1);
	            break;
	        case "k":
	            this.focus(-1);
	            break;
	        case "r":
	            this.res();
	            break;
	    }
	};

	function getBody() {
	    return document.body;
	}

	var css$1 = ".text {\n\twhite-space: pre-wrap;\n}\n.text,\n.extra {\n\tmin-width: 20rem;\n}\n.text_tree-mode-css,\n.extra_tree-mode-css {\n\tmargin-left: 1rem;\n}\n.env {\n\tfont-family: initial;\n\tfont-size: smaller;\n}\n\n.thread + .thread {\n\tmargin-top: 0.8rem;\n}\n\n.thread-header {\n\tbackground: #447733 none repeat scroll 0 0;\n\tborder-color: #669955 #225533 #225533 #669955;\n\tborder-style: solid;\n\tborder-width: 1px 2px 2px 1px;\n\tfont-size: 0.8rem;\n\tfont-family: normal;\n\tfont-weight: normal;\n\tmargin-top: 0.8rem;\n\tmargin-bottom: 0;\n\tpadding: 0;\n\tpadding-inline-start: 0.1rem;\n\twidth: 100%;\n}\n\n.message-header {\n\twhite-space: nowrap;\n}\n.message-header_tree-mode-css {\n\tfont-size: 0.85rem;\n\tfont-family: normal;\n}\n.message-info {\n\tfont-family: monospace;\n\tcolor: #87ce99;\n}\n\n.read .text,\n.quote {\n\tcolor: #ccb;\n}\nheader,\nfooter {\n\tdisplay: flex;\n\tfont-size: 0.9rem;\n\tjustify-content: space-between;\n}\n\n.modified {\n\tcolor: #fbb;\n}\n\n.note,\n.toggleCharacterEntity.on,\n.env {\n\tfont-style: italic;\n}\n\n.chainingHidden::after {\n\tcontent: \"この投稿も非表示になります\";\n\tfont-weight: bold;\n\tfont-style: italic;\n\tcolor: red;\n}\n.a-tree {\n\tfont-style: initial;\n\tvertical-align: top;\n}\n\n.border {\n\tdisplay: block;\n\tposition: absolute;\n\ttop: 1em;\n\ttop: 1lh;\n\twidth: 1px;\n\theight: 100%;\n\tbackground-color: #adb;\n\tz-index: -1;\n}\n\n.messageAndChildrenButLast {\n\tposition: relative;\n}\n\n.thumbnail-img {\n\twidth: 80px;\n\tmax-height: 400px;\n\timage-orientation: from-image;\n}\n#image-view {\n\tposition: fixed;\n\ttop: 50%;\n\tleft: 50%;\n\ttransform: translate(-50%, -50%);\n\tbackground: #004040;\n\tcolor: white;\n\tfont-weight: bold;\n\tfont-style: italic;\n\tmargin: 0;\n\timage-orientation: from-image;\n\tz-index: 9999;\n}\n.image-view-img {\n\tbackground-color: white;\n\tmax-width: 100vw;\n}\n\n.focused {\n\toutline: 2px solid yellow;\n}\n\n.truncation {\n\tdisplay: none;\n}\n.spacing {\n\tpadding-bottom: 1rem;\n}\n.spacer:first-child {\n\tdisplay: none;\n}\n\n.invalid.original blockquote {\n\tdisplay: none;\n}\n\n.vanishThread.stack::after,\n.toggleMessage::after {\n\tcontent: \"消\";\n}\n\n.invalid.original .vanishThread.stack::after,\n.toggleMessage.revert::after {\n\tcontent: \"戻\";\n}\n\n.showOriginalButtons + .message {\n\tdisplay: none;\n}\n\n.showMessage:not(.on),\n.showMessage.on ~ * {\n\tdisplay: none;\n}\n\n.qtv-error {\n\tfont-family: initial;\n\tborder: red solid;\n}\n";

	class Qtv {
	    initializeComponent() {
	        this.applyCss();
	        this.zero();
	        this.addEventListeners();
	        this.setAccesskeyToV();
	        this.setIdsToFormAndLinks();
	        this.registerKeyboardNavigation();
	    }
	    applyCss() {
	        document.head.insertAdjacentHTML("beforeend", `<style>${css$1 + this.config.css}</style>`);
	    }
	    zero() {
	        if (this.config.zero) {
	            const d = this.getD();
	            this.setZeroToD(d);
	        }
	    }
	    /** @returns {HTMLInputElement} */ getD() {
	        return /** @type {HTMLInputElement} */ document.getElementsByName("d")[0];
	    }
	    /**
		 * @param {?HTMLInputElement} d
		 */ setZeroToD(d) {
	        if (d && d.value !== "0") {
	            d.value = "0";
	        }
	    }
	    addEventListeners() {
	        getBody().addEventListener("mousedown", (e)=>{
	            const a = /** @type {HTMLAnchorElement} */ e.target;
	            if (a.closest("a")) {
	                this.tweakLink(a);
	            }
	        });
	    }
	    /**
		 * @param {HTMLAnchorElement} a
		 */ tweakLink(a) {
	        this.changeTargetToBlank(a);
	        this.appendNoreferrerAndNoopenerToPreventFromModifyingURL(a);
	    }
	    /**
		 * @param {HTMLAnchorElement} a
		 */ changeTargetToBlank(a) {
	        if (this.config.openLinkInNewTab && a.target === "link") {
	            a.target = "_blank";
	        }
	    }
	    appendNoreferrerAndNoopenerToPreventFromModifyingURL(a) {
	        if (a.target) {
	            a.rel += " noreferrer noopener";
	        }
	    }
	    setAccesskeyToV() {
	        const accessKey = this.config.accesskeyV;
	        if (accessKey.length === 1) {
	            const v = document.getElementsByName("v")[0];
	            if (v) {
	                v.accessKey = accessKey;
	                v.title = "内容";
	            }
	        }
	    }
	    setIdsToFormAndLinks() {
	        const form = document.forms[0];
	        if (form) {
	            this.setIdToForm(form);
	            this.setIdToLinks(form);
	        }
	    }
	    /**
		 * @param {HTMLFormElement} form
		 */ setIdToForm(form) {
	        form.id = "form";
	    }
	    /**
		 * @param {HTMLFormElement} form
		 */ setIdToLinks(form) {
	        const fonts = form.getElementsByTagName("font") //NOSONAR
	        ;
	        // これ以外に指定のしようがない
	        const link = fonts[fonts.length - 3];
	        if (link) {
	            link.id = "link";
	        }
	    }
	    registerKeyboardNavigation() {
	        if (this.config.keyboardNavigation) {
	            this.keyboardNavigation = new KeyboardNavigation(this.config);
	            document.addEventListener("keydown", this.keyboardNavigation, false);
	        }
	    }
	    /**
		 * @param {ParentNode} _fragment
		 */ render(_fragment) {
	    //empty
	    }
	    finish(_fragment) {
	        if (this.keyboardNavigation) {
	            this.keyboardNavigation.enableToReload();
	        }
	    }
	    /**
		 * 本来投稿が来るところの先頭に挿入
		 * @param {Node} node
		 */ insert(node) {
	        const hr = document.body.querySelector("body > hr");
	        if (hr) {
	            hr.parentNode.insertBefore(node, hr.nextSibling);
	        }
	    }
	    /**
		 * 一番下に追加
		 * @param {Node} node
		 */ append(node) {
	        document.body.appendChild(node);
	    }
	    /**
		 * 一番上に追加
		 * @param {Node} node
		 */ prepend(node) {
	        document.body.insertBefore(node, document.body.firstChild);
	    }
	    /**
		 * @param {Node} node
		 */ remove(node) {
	        node.parentNode.removeChild(node);
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        this.config = config;
	    }
	}

	/**
	 * @param {any} howManyPosts 何件表示されている振りをする？表示がある振りをする？
	 * @param {ParentNode} container Modify. \<P>\<I>\</I>\</P>から\<HR>が含まれている
	 */ function tweakFooter(howManyPosts, container) {
	    const i = container.querySelector("p i");
	    if (!i) {
	        return container;
	    }
	    /*
		 <P><I><FONT size="-1">ここまでは、現在登録されている新着順1番目から1番目までの記事っぽい！</FONT></I></P>
		 <TABLE>次のページ、リロードボタン</TABLE>
		 <HR>

		 `<TABLE>`は、このページに投稿がない、次のページに表示すべき投稿がない、のいずれかの場合は含まれない
		*/ const p = /** @type {HTMLElement} */ i.parentNode // === <P>
	    ;
	    const table = nextElement("TABLE")(p);
	    let end;
	    if (table && howManyPosts) {
	        // 消すのはpだけ
	        end = p;
	    } else {
	        // tableはないか、あるが0件の振りをするためtableは飛ばす
	        const hr = nextElement("HR")(p);
	        end = hr;
	    }
	    new _class().deleteContents(p, end);
	    return container;
	}

	function AButton(props) {
	    return /*#__PURE__*/ createNode("a", {
	        href: "javascript:;",
	        role: "button",
	        ...props
	    });
	}

	function sendMessageToRuntime(message) {
	    chrome.runtime.sendMessage(message);
	}

	function closeTab() {
	    if (isExtension()) {
	        sendMessageToRuntime({
	            type: "closeTab"
	        });
	    } else {
	        window.open("", "_parent");
	        window.close();
	    }
	}

	var css = "li {\n\tlist-style-type: none;\n}\n#configInfo {\n\tfont-weight: bold;\n\tfont-style: italic;\n}\nlegend + ul {\n\tmargin: 0 0 0 0;\n}\n.errormessage {\n\tdisplay: none;\n}\n[aria-invalid=\"true\"] {\n\toutline: 2px solid red;\n}\n[aria-invalid=\"true\"] ~ .errormessage {\n\tdisplay: initial;\n}\n";

	class ConfigView extends index_js.Component {
	    /**
		 * querySelector
		 * @param {string} selector
		 * @returns {HTMLInputElement}
		 */ $(selector) {
	        return this.elements[0].querySelector(selector);
	    }
	    /**
		 * querySelectorAll
		 * @param {string} selector
		 * @returns {HTMLInputElement[]}
		 */ $$(selector) {
	        return Array.prototype.slice.call(this.elements[0].querySelectorAll(selector));
	    }
	    render() {
	        const showExportArea = ()=>{
	            toggleExportImportArea(".exportArea", this.props.config.toMinimalJson());
	        };
	        const showImportArea = ()=>{
	            toggleExportImportArea(".importArea", "");
	        };
	        /**
			 * @param {string} targetClassToShow
			 * @param {string} text - 表示するテキスト
			 */ const toggleExportImportArea = (targetClassToShow, text)=>{
	            [
	                ".importArea, .exportArea"
	            ].forEach((className)=>{
	                this.$(className).style.display = "none";
	            });
	            this.$(`${targetClassToShow} textarea`).value = text;
	            this.$(targetClassToShow).style.display = "flex";
	        };
	        let importTextArea;
	        const importFromJSON = ()=>{
	            importTextArea.setAttribute("aria-invalid", "false");
	            const text = importTextArea.value.trim();
	            if (text === "") {
	                return;
	            }
	            try {
	                const json = JSON.parse(text);
	                return this.info(this.props.config.update(json), "インポートしました。");
	            } catch (e) {
	                importTextArea.setAttribute("aria-invalid", "true");
	            }
	        };
	        const previewQuotemeta = ()=>{
	            const output = this.$("#quote-output");
	            const input = this.$("#quote-input");
	            output.value = quotemeta(input.value);
	        };
	        const addToNGWord = ()=>{
	            let output = this.$("#quote-output").value;
	            if (!output.length) {
	                return;
	            }
	            const word = this.$("#NGWord").value;
	            if (word.length) {
	                output = word + "\n" + output;
	            }
	            this.$("#NGWord").value = output;
	            this.$("#NGWord").scrollTop = this.$("#NGWord").scrollHeight;
	            this.$$("#quote-output, #quote-input").forEach(function(el) {
	                el.value = "";
	            });
	        };
	        const validateRegExp = (/** @type {string} */ target)=>{
	            const ng = new NG({
	                useNG: true,
	                NGWord: this.$(target).value
	            });
	            this.$(target).setAttribute("aria-invalid", ng.errors.length ? "true" : "false");
	            this.$(`${target}Note`).innerHTML = "";
	            ng.errors.forEach(({ pattern, message })=>{
	                this.$(`${target}Note`).appendChild(/*#__PURE__*/ createNode("li", {
	                    children: [
	                        pattern,
	                        /*#__PURE__*/ createNode("blockquote", {
	                            children: message
	                        })
	                    ]
	                }));
	            });
	        };
	        const save = (e)=>{
	            e.preventDefault();
	            return this.info(this.props.config.update(formData()), "保存しました。", (e)=>`保存に失敗しました：${e.message}`);
	        };
	        /** @returns {Partial<import("../Config").ConfigOptions>} */ const formData = ()=>{
	            const items = {};
	            this.$$("input, select, textarea").forEach((el)=>{
	                const k = el.name;
	                let v = null;
	                if (!k) {
	                    return;
	                }
	                switch(el.type){
	                    case "radio":
	                        if (el.checked) {
	                            v = el.value;
	                        }
	                        break;
	                    case "text":
	                    case "textarea":
	                        v = el.value;
	                        break;
	                    case "checkbox":
	                        v = el.checked;
	                        break;
	                }
	                if (v !== null) {
	                    items[k] = v;
	                }
	            });
	            return items;
	        };
	        const clear = ()=>this.info((async ()=>{
	                this.populate();
	                await this.props.config.clear();
	            })(), "デフォルトに戻しました。");
	        const close = ()=>{
	            if (isExtension()) {
	                closeTab();
	            } else {
	                this.elements[0].remove();
	                window.scrollTo(0, 0);
	            }
	        };
	        const GF = "https://greasyfork.org/scripts/1971-tree-view-for-qwerty";
	        return /*#__PURE__*/ createNode("form", {
	            id: "config",
	            "aria-label": "設定",
	            children: [
	                /*#__PURE__*/ createNode("style", {
	                    children: css
	                }),
	                /*#__PURE__*/ createNode("fieldset", {
	                    children: [
	                        /*#__PURE__*/ createNode("legend", {
	                            children: "設定"
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "表示"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "radio",
	                                                        name: "viewMode",
	                                                        value: "t"
	                                                    }),
	                                                    "ツリー表示"
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "radio",
	                                                        name: "viewMode",
	                                                        value: "s"
	                                                    }),
	                                                    "スタック表示"
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "共通"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "zero",
	                                                            "aria-describedby": "explain-zero"
	                                                        }),
	                                                        "常に0件リロード"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("em", {
	                                                    id: "explain-zero",
	                                                    children: "（チェックを外しても「表示件数」は0のままなので手動で直してね）"
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    "未読リロードに使うアクセスキー",
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "text",
	                                                        name: "accesskeyReload",
	                                                        size: "1"
	                                                    })
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    "内容欄へのアクセスキー",
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "text",
	                                                        name: "accesskeyV",
	                                                        size: "1"
	                                                    })
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "keyboardNavigation",
	                                                            "aria-describedby": "explain-keyboardNavigation"
	                                                        }),
	                                                        "jkで移動、rでレス窓開く"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("em", {
	                                                    id: "explain-keyboardNavigation",
	                                                    children: /*#__PURE__*/ createNode("a", {
	                                                        href: `${GF}#keyboardNavigation`,
	                                                        children: "chrome以外の人は説明を読む"
	                                                    })
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("ul", {
	                                            children: /*#__PURE__*/ createNode("li", {
	                                                children: /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        "上から",
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "text",
	                                                            name: "keyboardNavigationOffsetTop",
	                                                            size: "4"
	                                                        }),
	                                                        "pxの位置に合わせる"
	                                                    ]
	                                                })
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "closeResWindow",
	                                                            "aria-describedby": "explain-closeResWindow"
	                                                        }),
	                                                        "書き込み完了した窓を閉じる"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("em", {
	                                                    id: "explain-closeResWindow",
	                                                    children: /*#__PURE__*/ createNode("a", {
	                                                        href: `${GF}#close-tab-in-greasemonkey`,
	                                                        children: "Greasemonkeyを使っている人は説明を読むこと"
	                                                    })
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {}),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "openLinkInNewTab"
	                                                    }),
	                                                    "target属性の付いたリンクを常に新しいタブで開く"
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "ツリーのみ"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    style: "display: inline-block",
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "deleteOriginal"
	                                                        }),
	                                                        "元の投稿を非表示にする"
	                                                    ]
	                                                }),
	                                                "（高速化）"
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                "スレッドの表示順",
	                                                /*#__PURE__*/ createNode("ul", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: /*#__PURE__*/ createNode("label", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "radio",
	                                                                        name: "threadOrder",
	                                                                        value: "ascending"
	                                                                    }),
	                                                                    "古→新"
	                                                                ]
	                                                            })
	                                                        }),
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: /*#__PURE__*/ createNode("label", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "radio",
	                                                                        name: "threadOrder",
	                                                                        value: "descending"
	                                                                    }),
	                                                                    "新→古"
	                                                                ]
	                                                            })
	                                                        })
	                                                    ]
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                "ツリーの表示に使うのは",
	                                                /*#__PURE__*/ createNode("ul", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: /*#__PURE__*/ createNode("label", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "radio",
	                                                                        name: "treeMode",
	                                                                        value: "tree-mode-css"
	                                                                    }),
	                                                                    "CSS"
	                                                                ]
	                                                            })
	                                                        }),
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: /*#__PURE__*/ createNode("label", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "radio",
	                                                                        name: "treeMode",
	                                                                        value: "tree-mode-ascii"
	                                                                    }),
	                                                                    "文字"
	                                                                ]
	                                                            })
	                                                        })
	                                                    ]
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "spacingBetweenMessages"
	                                                    }),
	                                                    "記事の間隔を開ける"
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "text",
	                                                        name: "maxLine",
	                                                        size: "2"
	                                                    }),
	                                                    "行以上は省略する"
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "characterEntity"
	                                                        }),
	                                                        "数値文字参照を展開"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("em", {
	                                                    children: "（&#数字;が置き換わる）"
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "toggleTreeMode"
	                                                    }),
	                                                    "CSSツリー時にスレッド毎に一時的な文字/CSSの切り替えが出来るようにする"
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                }),
	                                /*#__PURE__*/ createNode("fieldset", {
	                                    style: "display: inline-block",
	                                    children: [
	                                        /*#__PURE__*/ createNode("legend", {
	                                            children: "投稿非表示設定"
	                                        }),
	                                        /*#__PURE__*/ createNode("ul", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("li", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("label", {
	                                                            children: [
	                                                                /*#__PURE__*/ createNode("input", {
	                                                                    type: "checkbox",
	                                                                    name: "useVanishMessage",
	                                                                    "aria-describedby": "explain-useVanishMessage"
	                                                                }),
	                                                                "投稿非表示機能を使う"
	                                                            ]
	                                                        }),
	                                                        /*#__PURE__*/ createNode("em", {
	                                                            id: "explain-useVanishMessage",
	                                                            children: [
	                                                                "使う前に",
	                                                                /*#__PURE__*/ createNode("a", {
	                                                                    href: `${GF}@#vanishMessage`,
	                                                                    children: "投稿非表示機能の注意点"
	                                                                }),
	                                                                "を読むこと。"
	                                                            ]
	                                                        })
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("li", {
	                                                    children: /*#__PURE__*/ createNode("ul", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("li", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("span", {
	                                                                        id: "vanished-messages",
	                                                                        children: [
	                                                                            /*#__PURE__*/ createNode("span", {
	                                                                                id: "vanishedMessageIDs"
	                                                                            }),
	                                                                            "個の投稿を非表示中"
	                                                                        ]
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "button",
	                                                                        value: "クリア",
	                                                                        id: "clearVanishMessage",
	                                                                        "aria-describedby": "vanished-messages",
	                                                                        onClick: ()=>{
	                                                                            this.info(this.props.config.clearVanishedMessageIDs().then(()=>{
	                                                                                this.$("#vanishedMessageIDs").textContent = "0";
	                                                                            }), "非表示に設定されていた投稿を解除しました。");
	                                                                        }
	                                                                    })
	                                                                ]
	                                                            }),
	                                                            /*#__PURE__*/ createNode("li", {
	                                                                children: /*#__PURE__*/ createNode("label", {
	                                                                    children: [
	                                                                        /*#__PURE__*/ createNode("input", {
	                                                                            type: "checkbox",
	                                                                            name: "utterlyVanishMessage"
	                                                                        }),
	                                                                        "完全に非表示"
	                                                                    ]
	                                                                })
	                                                            }),
	                                                            /*#__PURE__*/ createNode("li", {
	                                                                children: /*#__PURE__*/ createNode("label", {
	                                                                    children: [
	                                                                        /*#__PURE__*/ createNode("input", {
	                                                                            type: "checkbox",
	                                                                            name: "vanishMessageAggressive"
	                                                                        }),
	                                                                        "パラノイア"
	                                                                    ]
	                                                                })
	                                                            })
	                                                        ]
	                                                    })
	                                                })
	                                            ]
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "スレッド非表示設定"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "useVanishThread"
	                                                    }),
	                                                    "スレッド非表示機能を使う"
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("ul", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("li", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("span", {
	                                                                id: "vanished-threads",
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("span", {
	                                                                        id: "vanishedThreadIDs"
	                                                                    }),
	                                                                    "個のスレッドを非表示中"
	                                                                ]
	                                                            }),
	                                                            /*#__PURE__*/ createNode("input", {
	                                                                type: "button",
	                                                                value: "クリア",
	                                                                id: "clearVanishThread",
	                                                                "aria-describedby": "vanished-threads",
	                                                                onClick: ()=>{
	                                                                    this.info(this.props.config.clearVanishedThreadIDs().then(()=>{
	                                                                        this.$("#vanishedThreadIDs").textContent = "0";
	                                                                    }), "非表示に設定されていたスレッドを解除しました。");
	                                                                }
	                                                            })
	                                                        ]
	                                                    }),
	                                                    /*#__PURE__*/ createNode("li", {
	                                                        children: /*#__PURE__*/ createNode("label", {
	                                                            children: [
	                                                                /*#__PURE__*/ createNode("input", {
	                                                                    type: "checkbox",
	                                                                    name: "utterlyVanishNGThread"
	                                                                }),
	                                                                "完全に非表示"
	                                                            ]
	                                                        })
	                                                    }),
	                                                    /*#__PURE__*/ createNode("li", {
	                                                        children: /*#__PURE__*/ createNode("label", {
	                                                            children: [
	                                                                /*#__PURE__*/ createNode("input", {
	                                                                    type: "checkbox",
	                                                                    name: "autovanishThread"
	                                                                }),
	                                                                "NGワードを含む投稿があったら、そのスレッドを自動的に非表示に追加する（ツリーのみ）"
	                                                            ]
	                                                        })
	                                                    })
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "画像"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "thumbnail"
	                                                        }),
	                                                        "小町と退避の画像のサムネイルを表示"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("ul", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: [
	                                                                /*#__PURE__*/ createNode("label", {
	                                                                    children: [
	                                                                        /*#__PURE__*/ createNode("input", {
	                                                                            type: "checkbox",
	                                                                            name: "thumbnailPopup"
	                                                                        }),
	                                                                        "ポップアップ表示"
	                                                                    ]
	                                                                }),
	                                                                /*#__PURE__*/ createNode("ul", {
	                                                                    children: /*#__PURE__*/ createNode("li", {
	                                                                        children: [
	                                                                            /*#__PURE__*/ createNode("label", {
	                                                                                children: [
	                                                                                    "最大幅：",
	                                                                                    /*#__PURE__*/ createNode("input", {
	                                                                                        type: "text",
	                                                                                        name: "popupMaxWidth",
	                                                                                        size: "5"
	                                                                                    })
	                                                                                ]
	                                                                            }),
	                                                                            /*#__PURE__*/ createNode("label", {
	                                                                                children: [
	                                                                                    "最大高：",
	                                                                                    /*#__PURE__*/ createNode("input", {
	                                                                                        type: "text",
	                                                                                        name: "popupMaxHeight",
	                                                                                        size: "5"
	                                                                                    })
	                                                                                ]
	                                                                            }),
	                                                                            /*#__PURE__*/ createNode("em", {
	                                                                                children: "空欄だとウィンドウサイズが使われる"
	                                                                            })
	                                                                        ]
	                                                                    })
	                                                                })
	                                                            ]
	                                                        }),
	                                                        /*#__PURE__*/ createNode("li", {
	                                                            children: /*#__PURE__*/ createNode("label", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "checkbox",
	                                                                        name: "shouki"
	                                                                    }),
	                                                                    "詳希(;ﾟДﾟ)"
	                                                                ]
	                                                            })
	                                                        })
	                                                    ]
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "popupAny"
	                                                    }),
	                                                    "小町と退避以外の画像も対象にする"
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "NGワード"
	                                }),
	                                /*#__PURE__*/ createNode("ul", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "useNG",
	                                                            "aria-describedby": "explain-useNG"
	                                                        }),
	                                                        "NGワードを使う"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("div", {
	                                                    id: "explain-useNG",
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("p", {
	                                                            children: [
	                                                                "指定には正規表現を使う。以下簡易説明。複数指定するには",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: "|"
	                                                                }),
	                                                                '(縦棒)で"区切る"（先頭や末尾につけてはいけない）。',
	                                                                " ",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: [
	                                                                        "()?*+[]",
	                                                                        "^$.\\/"
	                                                                    ]
	                                                                }),
	                                                                " の前には ",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: "\\"
	                                                                }),
	                                                                " を付ける。"
	                                                            ]
	                                                        }),
	                                                        /*#__PURE__*/ createNode("p", {
	                                                            children: [
	                                                                "本文は ",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: "|"
	                                                                }),
	                                                                " の代わりに改行でも良い。",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: "/正規表現/flags"
	                                                                }),
	                                                                " の記法も可能。",
	                                                                /*#__PURE__*/ createNode("kbd", {
	                                                                    children: "#"
	                                                                }),
	                                                                " ",
	                                                                "で始まる行、空白だけの行、エラーがある行は無視される。"
	                                                            ]
	                                                        })
	                                                    ]
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("table", {
	                                                role: "presentation",
	                                                children: [
	                                                    /*#__PURE__*/ createNode("tr", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: /*#__PURE__*/ createNode("label", {
	                                                                    for: "NGHandle",
	                                                                    children: "ハンドル"
	                                                                })
	                                                            }),
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        id: "NGHandle",
	                                                                        type: "text",
	                                                                        name: "NGHandle",
	                                                                        size: "30",
	                                                                        "aria-errormessage": "NGHandleNote",
	                                                                        "aria-describedby": "explain-NGHandle",
	                                                                        onInput: ()=>validateRegExp("#NGHandle")
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("em", {
	                                                                        id: "explain-NGHandle",
	                                                                        children: "投稿者とメールと題名"
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("span", {
	                                                                        id: "NGHandleNote",
	                                                                        class: "errormessage"
	                                                                    })
	                                                                ]
	                                                            })
	                                                        ]
	                                                    }),
	                                                    /*#__PURE__*/ createNode("tr", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: /*#__PURE__*/ createNode("label", {
	                                                                    for: "NGWord",
	                                                                    children: "本文"
	                                                                })
	                                                            }),
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("textarea", {
	                                                                        id: "NGWord",
	                                                                        type: "text",
	                                                                        name: "NGWord",
	                                                                        cols: "50",
	                                                                        rows: Math.max(this.props.config.NGWord.split("\n").length + 1, 5),
	                                                                        "aria-errormessage": "NGWordNote",
	                                                                        onInput: ()=>validateRegExp("#NGWord")
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("ul", {
	                                                                        id: "NGWordNote",
	                                                                        class: "errormessage"
	                                                                    })
	                                                                ]
	                                                            })
	                                                        ]
	                                                    }),
	                                                    /*#__PURE__*/ createNode("tr", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("td", {}),
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        id: "quote-input",
	                                                                        type: "text",
	                                                                        size: "15",
	                                                                        value: "",
	                                                                        "aria-describedby": "explain-quote-input",
	                                                                        onKeyUp: ()=>previewQuotemeta()
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("span", {
	                                                                        id: "explain-quote-input",
	                                                                        children: "よく分からん人はここにNGワードを一つづつ入力して追加ボタンだ"
	                                                                    })
	                                                                ]
	                                                            })
	                                                        ]
	                                                    }),
	                                                    /*#__PURE__*/ createNode("tr", {
	                                                        children: [
	                                                            /*#__PURE__*/ createNode("td", {}),
	                                                            /*#__PURE__*/ createNode("td", {
	                                                                children: [
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        id: "quote-output",
	                                                                        type: "text",
	                                                                        size: "15",
	                                                                        readonly: true
	                                                                    }),
	                                                                    /*#__PURE__*/ createNode("input", {
	                                                                        type: "button",
	                                                                        id: "addToNGWord",
	                                                                        value: "本文に追加",
	                                                                        onClick: addToNGWord
	                                                                    })
	                                                                ]
	                                                            })
	                                                        ]
	                                                    })
	                                                ]
	                                            })
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: [
	                                                /*#__PURE__*/ createNode("label", {
	                                                    children: [
	                                                        /*#__PURE__*/ createNode("input", {
	                                                            type: "checkbox",
	                                                            name: "NGCheckMode",
	                                                            "aria-describedby": "explain-NGCheckMode"
	                                                        }),
	                                                        "NGワードを含む投稿を畳まず、NGワードをハイライトする。"
	                                                    ]
	                                                }),
	                                                /*#__PURE__*/ createNode("em", {
	                                                    id: "explain-NGCheckMode",
	                                                    children: "（全てのNGワードがハイライトされるとは期待しないでください。）"
	                                                })
	                                            ]
	                                        }),
	                                        /*#__PURE__*/ createNode("li", {
	                                            children: /*#__PURE__*/ createNode("label", {
	                                                children: [
	                                                    /*#__PURE__*/ createNode("input", {
	                                                        type: "checkbox",
	                                                        name: "utterlyVanishNGStack"
	                                                    }),
	                                                    "完全非表示"
	                                                ]
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("p", {
	                            children: [
	                                /*#__PURE__*/ createNode("label", {
	                                    for: "css",
	                                    children: "追加CSS"
	                                }),
	                                /*#__PURE__*/ createNode("br", {}),
	                                /*#__PURE__*/ createNode("textarea", {
	                                    id: "css",
	                                    name: "css",
	                                    cols: "70",
	                                    rows: "5"
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("fieldset", {
	                            children: [
	                                /*#__PURE__*/ createNode("legend", {
	                                    children: "エクスポート／インポート"
	                                }),
	                                /*#__PURE__*/ createNode("button", {
	                                    type: "button",
	                                    id: "showExportArea",
	                                    onClick: showExportArea,
	                                    children: "エクスポート"
	                                }),
	                                /*#__PURE__*/ createNode("input", {
	                                    type: "button",
	                                    id: "showImportArea",
	                                    value: "インポート",
	                                    onClick: showImportArea
	                                }),
	                                /*#__PURE__*/ createNode("div", {
	                                    class: "exportArea",
	                                    style: "display: none",
	                                    "aria-labelledby": "showExportArea",
	                                    children: /*#__PURE__*/ createNode("textarea", {
	                                        rows: "5",
	                                        cols: "50",
	                                        "aria-label": "Export area"
	                                    })
	                                }),
	                                /*#__PURE__*/ createNode("div", {
	                                    class: "importArea",
	                                    style: "display: none",
	                                    "aria-labelledby": "showImportArea",
	                                    children: [
	                                        /*#__PURE__*/ createNode("textarea", {
	                                            rows: "5",
	                                            cols: "50",
	                                            "aria-label": "Import area",
	                                            "aria-errormessage": "importNote",
	                                            ref: (el)=>importTextArea = el
	                                        }),
	                                        /*#__PURE__*/ createNode("span", {
	                                            id: "importNote",
	                                            class: "errormessage",
	                                            children: "データが不正のため、インポート出来ませんでした。"
	                                        }),
	                                        /*#__PURE__*/ createNode("div", {
	                                            children: /*#__PURE__*/ createNode("input", {
	                                                type: "button",
	                                                id: "import",
	                                                value: "インポートする",
	                                                onClick: importFromJSON
	                                            })
	                                        })
	                                    ]
	                                })
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode("p", {
	                            style: "display: flex; justify-content: space-between",
	                            children: [
	                                /*#__PURE__*/ createNode("span", {
	                                    children: [
	                                        /*#__PURE__*/ createNode("input", {
	                                            type: "submit",
	                                            id: "save",
	                                            accessKey: "s",
	                                            title: "くわツリービューの設定を保存する",
	                                            value: "保存[s]",
	                                            onClick: save
	                                        }),
	                                        /*#__PURE__*/ createNode("input", {
	                                            type: "button",
	                                            id: "close",
	                                            accessKey: "c",
	                                            title: "くわツリービューの設定を閉じる",
	                                            value: "閉じる[c]",
	                                            onClick: close
	                                        }),
	                                        /*#__PURE__*/ createNode("span", {
	                                            id: "configStatus"
	                                        })
	                                    ]
	                                }),
	                                /*#__PURE__*/ createNode("span", {
	                                    children: /*#__PURE__*/ createNode("input", {
	                                        type: "button",
	                                        id: "clear",
	                                        value: "デフォルトに戻す",
	                                        onClick: clear
	                                    })
	                                })
	                            ]
	                        })
	                    ]
	                })
	            ]
	        });
	    }
	    /**
		 * @param {Promise} promise
		 * @param {string} success
		 * @param {(e: Error) => string} [errorFunction]
		 */ async info(promise, success, errorFunction = ()=>"") {
	        const status = this.$("#configStatus");
	        clearTimeout(this.clearTimeoutId);
	        status.textContent = "保存中";
	        try {
	            await promise;
	            status.textContent = success;
	            return new Promise((resolve)=>{
	                this.clearTimeoutId = setTimeout(()=>{
	                    status.innerHTML = "";
	                    resolve();
	                }, 5000);
	            });
	        } catch (e) {
	            status.textContent = errorFunction(e);
	        }
	    }
	    didMount() {
	        this.populate();
	        this.elements[0].scrollIntoView();
	    }
	    didUpdate() {
	        this.populate();
	    }
	    populate() {
	        const config = this.props.config;
	        this.$("#vanishedThreadIDs").textContent = "" + config.numVanishedThreads();
	        this.$("#vanishedMessageIDs").textContent = "" + config.numVanishedMessages();
	        this.$$("input, select, textarea").forEach(function(el) {
	            const name = el.name;
	            if (!name) {
	                return;
	            }
	            const value = config[name];
	            switch(el.type){
	                case "radio":
	                    el.checked = value === el.value;
	                    break;
	                case "text":
	                case "textarea":
	                    el.value = value;
	                    break;
	                case "checkbox":
	                    el.checked = value;
	                    break;
	            }
	        });
	        [
	            "#NGWord",
	            "#NGHandle"
	        ].forEach((target)=>{
	            this.$(target).dispatchEvent(new Event("input"));
	        });
	    }
	    constructor(...args){
	        super(...args);
	        /** @type {NodeJS.Timeout} */ this.clearTimeoutId = null;
	    }
	}
	/**
	 *
	 * @param {string} str
	 * @returns {string}
	 */ const quotemeta = function(str) {
	    return (str + "").replace(/[$()*+.?[\\\]^{|}]/gu, "\\$&");
	};

	/**
	 * @typedef {object} Props
	 * @property {import("Config").default} config
	 * @property {any} children
	 */ /**
	 * @param {Props} props
	 */ function OpenConfig(props) {
	    const { config, children } = props;
	    return /*#__PURE__*/ createNode(AButton, {
	        id: "openConfig",
	        onClick: (e)=>{
	            e.preventDefault();
	            if (isExtension()) {
	                openConfigOnExtension();
	            } else if (noConfigPageOpen()) {
	                openConfigOnGreaseMonkey();
	            }
	        },
	        children: children
	    });
	    function openConfigOnExtension() {
	        sendMessageToRuntime({
	            type: "openConfig"
	        });
	    }
	    function noConfigPageOpen() {
	        return !document.getElementById("config");
	    }
	    function openConfigOnGreaseMonkey() {
	        document.body.prepend(index_js.render(/*#__PURE__*/ createNode(ConfigView, {
	            config: config
	        })));
	    }
	}

	/**
	 * @typedef {object} Props
	 * @property {import("Config").default} config
	 * @property {import("NG").default} ng
	 * @param {Props} props
	 */ function MiniInfo(props) {
	    const numVanishedThreads = props.config.numVanishedThreads();
	    return /*#__PURE__*/ createNode("span", {
	        id: "qtv-miniInfo",
	        children: [
	            /*#__PURE__*/ createNode(OpenConfig, {
	                config: props.config,
	                children: "★くわツリービューの設定★"
	            }),
	            !!numVanishedThreads && /*#__PURE__*/ createNode(Fragment, {
	                children: [
	                    " ",
	                    "非表示解除(",
	                    /*#__PURE__*/ createNode(AButton, {
	                        class: "clearVanishedThreadIDs",
	                        onClick: (e)=>{
	                            e.preventDefault();
	                            e.currentTarget.querySelector(".count").textContent = 0;
	                            props.config.clearVanishedThreadIDs();
	                        },
	                        children: [
	                            /*#__PURE__*/ createNode("span", {
	                                class: "count",
	                                children: numVanishedThreads
	                            }),
	                            "スレッド"
	                        ]
	                    }),
	                    ")"
	                ]
	            }),
	            " ",
	            !!props.ng.message && /*#__PURE__*/ createNode("span", {
	                role: "alert",
	                "aria-live": "polite",
	                children: props.ng.message
	            })
	        ]
	    });
	}

	class Popup extends index_js.Component {
	    didMount() {
	        if (this.props.isPoppedUp) {
	            this.body.addEventListener("keydown", this);
	        }
	    }
	    didUnmount() {
	        this.body.removeEventListener("keydown", this);
	        if (this.waitingMetadata) {
	            clearTimeout(this.waitingMetadata);
	        }
	    }
	    /**
		 * @param {KeyboardEvent} e
		 */ handleEvent(e) {
	        if (this.isEscapePressed(e)) {
	            this.props.close(false);
	        }
	    }
	    /**
		 * @param {KeyboardEvent} e
		 */ isEscapePressed(e) {
	        return /^Esc(?:ape)?$/.test(e.key);
	    }
	    render() {
	        const complete = (/** @type {string} */ note)=>{
	            this.setState({
	                complete: true
	            });
	            this.props.setNote(note);
	        };
	        this.initState = {
	            complete: false
	        };
	        if (this.props.isPoppedUp) {
	            this.waitingMetadata = setTimeout(()=>{
	                if (!this.state.complete) {
	                    this.props.setNote("ダウンロード中");
	                }
	                this.waitAndOpen();
	            }, 0);
	        }
	        return /*#__PURE__*/ createNode("figure", {
	            id: "image-view",
	            class: "popup",
	            style: "visibility: hidden",
	            onclick: ()=>this.props.close(false),
	            // role="dialog"
	            "aria-modal": "true",
	            "aria-roledescription": "画像ポップアップ",
	            children: [
	                /*#__PURE__*/ createNode("figcaption", {
	                    children: [
	                        /*#__PURE__*/ createNode("span", {
	                            id: "percentage"
	                        }),
	                        "%"
	                    ]
	                }),
	                /*#__PURE__*/ createNode("img", {
	                    referrerPolicy: "same-origin",
	                    class: "image-view-img",
	                    src: this.props.src,
	                    onload: ()=>complete(""),
	                    onerror: ()=>complete("404?画像ではない？"),
	                    // role="content"
	                    "aria-label": this.props.src
	                })
	            ]
	        });
	    }
	    // bodyに追加することでimage-orientationが適用され
	    // natural(Width|Height)以外の.*(width|height)が
	    // EXIFのorientationが適用された値になる
	    meta() {
	        const { config } = this.props;
	        const imageView = this.elements[0];
	        const image = imageView.querySelector("img");
	        const { clientHeight, clientWidth } = document.compatMode === "BackCompat" ? document.body : document.documentElement;
	        const maxHeight = clientHeight - (Math.round(imageView.getBoundingClientRect().height) - image.offsetHeight);
	        const maxWidth = clientWidth;
	        image.style.maxHeight = String(config.popupMaxHeight || maxHeight);
	        image.style.maxWidth = String(config.popupMaxWidth || maxWidth);
	        const ratio = getRatio();
	        imageView.querySelector("#percentage").textContent = String(Math.floor(ratio * 100));
	        imageView.style.cssText = "background-color: " + (ratio < 0.5 ? "red" : ratio < 0.9 ? "blue" : "green");
	        function getRatio() {
	            const { naturalHeight: original, clientHeight: length } = image;
	            if (original > length) {
	                return length / original;
	            } else {
	                return 1;
	            }
	        }
	    }
	    constructor(...args){
	        super(...args);
	        /** @type {NodeJS.Timeout} */ this.waitingMetadata = null;
	        this.id = `Popup+${this.props.src}`;
	        var _this_props_body;
	        this.body = (_this_props_body = this.props.body) != null ? _this_props_body : document.body;
	        this.waitAndOpen = ()=>{
	            const image = this.elements[0].querySelector("img");
	            if (image.complete || image.naturalWidth !== 0 || image.naturalHeight !== 0) {
	                this.waitingMetadata = null;
	                this.meta();
	            } else {
	                this.waitingMetadata = setTimeout(this.waitAndOpen, 50);
	            }
	        };
	    }
	}

	class ImageHoverPopup extends index_js.Component {
	    willUpdate() {
	        if (this.state.popup === this) {
	            document.body.addEventListener("mouseover", this);
	        } else if (this.state.popup == null) {
	            document.body.removeEventListener("mouseover", this);
	        }
	    }
	    handleEvent(e) {
	        if (!e.target.closest(".popup")) {
	            this.close(true);
	        }
	    }
	    render() {
	        const { hrefForOriginalSize, thumbnailSrc } = this.props;
	        const className = {};
	        if (this.state.popup === this) {
	            className.class = "popup";
	        }
	        return /*#__PURE__*/ createNode("span", {
	            children: [
	                !thumbnailSrc && "[",
	                /*#__PURE__*/ createNode("span", {
	                    ...className,
	                    "aria-haspopup": "dialog",
	                    children: [
	                        /*#__PURE__*/ createNode("a", {
	                            href: hrefForOriginalSize,
	                            target: "link",
	                            class: "thumbnail",
	                            onMouseEnter: ()=>{
	                                if (this.props.config.thumbnailPopup && !this.state.popup && this.state.allows) {
	                                    this.setState({
	                                        popup: this,
	                                        allows: false
	                                    });
	                                    this.update();
	                                }
	                            },
	                            children: thumbnailSrc ? /*#__PURE__*/ createNode("img", {
	                                referrerPolicy: "same-origin",
	                                class: "thumbnail-img",
	                                src: thumbnailSrc
	                            }) : "■"
	                        }),
	                        /*#__PURE__*/ createNode(Popup, {
	                            config: this.props.config,
	                            src: hrefForOriginalSize,
	                            close: this.close,
	                            setNote: (note)=>{
	                                if (this.note !== note) {
	                                    this.note = note;
	                                    this.update();
	                                }
	                            },
	                            isPoppedUp: this.state.popup === this
	                        })
	                    ]
	                }),
	                /*#__PURE__*/ createNode("span", {
	                    class: "note",
	                    children: this.note
	                }),
	                !thumbnailSrc && "]",
	                this.props.config.shouki && /*#__PURE__*/ createNode(Fragment, {
	                    children: [
	                        "[",
	                        /*#__PURE__*/ createNode("a", {
	                            href: `https://lens.google.com/uploadbyurl?url=${hrefForOriginalSize}`,
	                            target: "link",
	                            class: "shouki",
	                            children: "詳"
	                        }),
	                        "]"
	                    ]
	                }),
	                this.props.children
	            ]
	        });
	    }
	    /**
		 * @param {Props} props
		 */ constructor(props){
	        super(props);
	        this.close = (allowsImmediatelyPoppingUp)=>{
	            if (this.state.popup === this) {
	                this.setState({
	                    popup: null
	                });
	                if (allowsImmediatelyPoppingUp) {
	                    this.setState({
	                        allows: true
	                    });
	                } else {
	                    setTimeout(()=>{
	                        this.setState({
	                            allows: true
	                        });
	                    }, 100);
	                }
	                this.update();
	            }
	        };
	        props.hrefForOriginalSize = props.href;
	        this.initState = {
	            allows: true,
	            popup: undefined
	        };
	    }
	}
	ImageHoverPopup.prototype.note = "";

	class Media extends index_js.Component {
	    render() {
	        return /*#__PURE__*/ createNode("span", {
	            children: [
	                "[",
	                /*#__PURE__*/ createNode(AButton, {
	                    class: "embed",
	                    onclick: ()=>this.handleClick(),
	                    children: "埋"
	                }),
	                "]",
	                !!this.height && !!this.width && /*#__PURE__*/ createNode("span", {
	                    class: "metadata",
	                    children: [
	                        "[",
	                        this.width,
	                        "x",
	                        this.height,
	                        "]"
	                    ]
	                }),
	                this.props.children,
	                this.embedded && /*#__PURE__*/ createNode("div", {
	                    style: "white-space: initial",
	                    children: this.props.media
	                })
	            ]
	        });
	    }
	    setMetadata() {
	        const { videoHeight: height, videoWidth: width } = /** @type {HTMLVideoElement} */ this.props.media;
	        this.height = height;
	        this.width = width;
	    }
	    didUpdate() {
	        const el = this.elements[0];
	        const text = el.closest(".text_tree-mode-ascii");
	        const branch = text == null ? void 0 : text.querySelector(".a-tree:not(.spacer)");
	        if (branch) {
	            el.querySelector("div").prepend(branch.cloneNode(true));
	        }
	    }
	    constructor(...args){
	        super(...args);
	        this.handleClick = ()=>{
	            const { media } = this.props;
	            this.embedded = !this.embedded;
	            if (media instanceof HTMLVideoElement && !this.width) {
	                if (media.videoWidth) {
	                    this.setMetadata();
	                } else if (!media.onloadedmetadata) {
	                    media.onloadedmetadata = ()=>{
	                        this.setMetadata();
	                        this.update();
	                    };
	                }
	            }
	            this.update();
	        };
	    }
	}

	const misao = /^https?:\/\/misao\.mixh\.jp\/c\//;
	const videoReg = /^[^?#]+\.(?:webm|avi|mov|mp[4g]|wmv|ogg)(?:[?#]|$)/i;
	const audioReg = /^[^?#]+\.(?:mp3|m4a|wma|au|mid|wav|opus|aac)(?:[?#]|$)/i;
	// eslint-disable-next-line regexp/no-empty-group
	const pass = /(?:)/ //NOSONAR
	;
	/**
	 * @typedef {object} Props
	 * @property {import("Config").default} config
	 * @property {string} href
	 * @property {any} children
	 * @augments Component<Props>
	 */ class Site extends index_js.Component {
	    /**
		 * @param {Props} props
		 */ static canRender(props) {
	        const { href } = props;
	        return (this.popup || props.config.popupAny) && this.prefix.test(href) && this.suffix.test(href);
	    }
	}
	Site.popup = false;
	Site.prefix = pass;
	Site.suffix = pass;
	class Image extends Site {
	    render() {
	        return /*#__PURE__*/ createNode(ImageHoverPopup, {
	            ...this.props,
	            ...this.computeProps()
	        });
	    }
	    computeProps() {
	        return {};
	    }
	}
	class Audio extends Site {
	    render() {
	        return /*#__PURE__*/ createNode(Media, {
	            media: /*#__PURE__*/ createNode("audio", {
	                controls: true,
	                preload: "auto",
	                src: this.props.href
	            }),
	            children: this.props.children
	        });
	    }
	}
	class Video extends Site {
	    render() {
	        return /*#__PURE__*/ createNode(Media, {
	            media: /*#__PURE__*/ createNode("video", {
	                controls: true,
	                preload: "auto",
	                loop: true,
	                src: this.props.href
	            }),
	            children: this.props.children
	        });
	    }
	}
	class MisaoImage extends Image {
	    computeProps() {
	        return {
	            thumbnailSrc: this.small()
	        };
	    }
	    small() {
	        return this.props.href.replace(/^(https?:\/\/misao\.mixh\.jp\/c)\/up\/(misao\d+\.\w+)$/, "$1/up/pixy_$2");
	    }
	}
	MisaoImage.popup = true;
	MisaoImage.prefix = misao;
	MisaoImage.suffix = /\.(?:jpe?g|png|gif|bmp|webp|avif)$/;
	class MisaoAudio extends Audio {
	}
	MisaoAudio.popup = true;
	MisaoAudio.prefix = misao;
	MisaoAudio.suffix = audioReg;
	class MisaoVideo extends Video {
	}
	MisaoVideo.popup = true;
	MisaoVideo.prefix = misao;
	MisaoVideo.suffix = videoReg;
	class Imgur extends Image {
	    /** @override */ computeProps() {
	        return {
	            thumbnailSrc: this.src("t")
	        };
	    }
	    /**
		 * @param {"h"|"m"|"l"|"t"} suffix
		 */ src(suffix) {
	        return this.props.href.replace(/^https?:\/\/(?:i\.)?/, "https://i.").replace(/\.\w+$/, `${suffix}$&`);
	    }
	}
	Imgur.prefix = /^https?:\/\/(?:i\.)?imgur\.com\/[^/]+$/;
	class Twimg extends Image {
	    /** @override */ computeProps() {
	        return {
	            hrefForOriginalSize: this.src("orig"),
	            thumbnailSrc: this.src("thumb")
	        };
	    }
	    /**
		 * @param {"thumb"|"large"|"medium"|"small"|"orig"} sizeName
		 * @see {@link https://developer.twitter.com/en/docs/twitter-api/v1/data-dictionary/object-model/entities#photo_format} for the URL format
		 */ src(sizeName) {
	        const match = /** @type {typeof Twimg} */ this.constructor.prefix.exec(this.props.href);
	        const url = new URL(this.props.href);
	        const search = new URLSearchParams(url.search);
	        if (!match.groups.ext) {
	            search.set("format", "jpg");
	        }
	        search.set("name", sizeName);
	        url.search = search.toString();
	        return url;
	    }
	}
	Twimg.prefix = RegExp("^https?:\\/\\/pbs\\.twimg\\.com\\/media\\/[\\w-]+(?<ext>\\.\\w+)?");
	class AnyImage extends Image {
	}
	AnyImage.suffix = /^[^?#]+\.(?:jpe?g|png|gif|bmp|webp|apng|avif|svg)(?:[?#]|$)/i;
	class AnyAudio extends Audio {
	}
	AnyAudio.suffix = audioReg;
	class AnyVideo extends Video {
	}
	AnyVideo.suffix = videoReg;
	const Sites = [
	    MisaoImage,
	    MisaoAudio,
	    MisaoVideo,
	    Imgur,
	    Twimg,
	    AnyImage,
	    AnyAudio,
	    AnyVideo
	];

	class Embedder {
	    /** @param {Element} container */ register(container) {
	        /** @type {NodeListOf<HTMLAnchorElement>} */ const as = container.querySelectorAll("a[target]");
	        for (const a of as){
	            const embed = this.embed({
	                config: this.config,
	                href: a.href,
	                children: [
	                    a.cloneNode(true)
	                ]
	            });
	            if (embed) {
	                a.replaceWith(index_js.render(embed));
	            }
	        }
	    }
	    /**
		 * @private
		 * @param {import("./Sites").Props} props
		 */ embed(props) {
	        const Site = Sites.find((Site)=>Site.canRender(props));
	        return Site ? /*#__PURE__*/ createNode(Site, {
	            ...props
	        }) : null;
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        this.config = config;
	    }
	}

	/**
	 * @param {HTMLAnchorElement} a
	 */ function collectElements(a) {
	    const el = collectEssentialElements(a);
	    return {
	        el,
	        name: el.name.innerHTML,
	        title: el.title.innerHTML,
	        text: el.pre.innerHTML,
	        isNG: false,
	        threadId: el.threadButton ? /&s=([^&]+)/.exec(el.threadButton.search)[1] : el.anchor.name
	    };
	}

	/**
	 * @param {Element} element
	 * @returns () => void
	 */ function savePosition(element) {
	    const top = element.getBoundingClientRect().top;
	    return function restorePosition() {
	        window.scrollTo(window.scrollX, window.scrollY + element.getBoundingClientRect().top - top);
	    };
	}

	/**
	 * @param {object} arg
	 * @param {import("../Config").default} arg.config
	 * @param {import("wrapper/Range").default} arg.range
	 * @param {HTMLAnchorElement} arg.a
	 * @param {ParentNode} arg.f
	 */ function renderPost({ config, range, a, f }) {
	    if (!a) {
	        return f;
	    }
	    const ng = new NG(config);
	    const embedder = new Embedder(config);
	    const data = collectElements(a);
	    const isVanished = config.isVanishedThread(data.threadId);
	    if (config.utterlyVanishNGThread && isVanished) {
	        return a;
	    }
	    const isNG = ng.testWord(data.text) || ng.testHandle(data.name) || ng.testHandle(data.title);
	    if (config.utterlyVanishNGStack && isNG) {
	        return a;
	    }
	    markNG();
	    registerThumbnail();
	    insertVanishThreadButton();
	    const message = /*#__PURE__*/ createNode("article", {
	        class: "message original",
	        "data-thread-id": data.threadId
	    });
	    range.surroundContents(message, data.el.anchor, data.el.blockquote);
	    const buttons = [];
	    if (isVanished) {
	        buttons.push(/*#__PURE__*/ createNode(AButton, {
	            class: "showThread",
	            title: "このスレッドは非表示に設定されています",
	            onClick: (e)=>cancelVanishThread(e),
	            children: "非表示解除"
	        }));
	    }
	    if (!config.NGCheckMode && isNG) {
	        buttons.push(/*#__PURE__*/ createNode(AButton, {
	            class: "showNG",
	            title: "この投稿にはNGワードが含まれるため、非表示になっています",
	            onClick: (e)=>e.currentTarget.parentElement.remove(),
	            children: "NG"
	        }));
	    }
	    if (buttons.length) {
	        message.before(/*#__PURE__*/ createNode("div", {
	            class: "showOriginalButtons",
	            children: buttons
	        }));
	    }
	    return f;
	    function insertVanishThreadButton() {
	        if (!config.useVanishThread) {
	            return;
	        }
	        [
	            index_js.render(/*#__PURE__*/ createNode(AButton, {
	                class: "vanishThread stack",
	                title: "スレッドを非表示にします",
	                onClick: (e)=>toggleVanishThread(e)
	            })),
	            document.createTextNode("　 ")
	        ].forEach((el)=>{
	            data.el.resButton.parentNode.insertBefore(el, data.el.threadButton);
	        });
	    }
	    function markNG() {
	        if (ng.testWord(data.text)) {
	            data.el.pre.innerHTML = ng.markWord(data.text);
	        }
	        if (ng.testHandle(data.name)) {
	            data.el.name.innerHTML = ng.markHandle(data.name);
	        }
	        if (ng.testHandle(data.title)) {
	            data.el.title.innerHTML = ng.markHandle(data.title);
	        }
	    }
	    function registerThumbnail() {
	        if (config.thumbnail) {
	            embedder.register(data.el.pre);
	        }
	    }
	    /**
		 * @param {MouseEvent} e
		 */ function cancelVanishThread(e) {
	        e.preventDefault();
	        config.removeVanishedThread(data.threadId);
	        const button = /** @type {Element} */ e.currentTarget;
	        const restore = savePosition(button);
	        document.querySelectorAll(`.message[data-thread-id="${data.threadId}"]`).forEach((m)=>{
	            if (m === message) {
	                restore();
	            }
	            m.previousElementSibling.remove();
	        });
	    }
	    /**
		 * @param {MouseEvent} e
		 */ function toggleVanishThread(e) {
	        e.preventDefault();
	        const restore = savePosition(message);
	        if (message.classList.contains("invalid")) {
	            config.removeVanishedThread(data.threadId);
	        } else {
	            config.addVanishedThread(data.threadId);
	        }
	        document.querySelectorAll(`.message[data-thread-id="${data.threadId}"]`).forEach((m)=>m.classList.toggle("invalid"));
	        restore();
	    }
	}

	class StackView extends Qtv {
	    setPresenter(presenter) {
	        this.presenter = presenter;
	    }
	    initializeComponent() {
	        this.setupMiniInfo();
	        this.showConfigError();
	        this.accesskey();
	        super.initializeComponent();
	        this.insert(this.el);
	    }
	    setupMiniInfo() {
	        const setup = document.body.querySelector('input[name="setup"]');
	        if (!setup) {
	            return;
	        }
	        this.showMiniInfo(setup);
	    }
	    showMiniInfo(setup) {
	        setup.after(...[
	            "　",
	            index_js.render(/*#__PURE__*/ createNode(MiniInfo, {
	                config: this.config,
	                ng: this.ng
	            }))
	        ]);
	    }
	    showConfigError() {
	        if (this.config.error) {
	            document.body.prepend(/*#__PURE__*/ createNode("div", {
	                role: "alert",
	                "aria-live": "polite",
	                children: [
	                    "設定のロードに失敗したためデフォルト値で表示しています：",
	                    " ",
	                    this.config.error.message
	                ]
	            }));
	        }
	    }
	    accesskey() {
	        const midoku = /** @type {HTMLElement} */ document.body.querySelector('input[name="midokureload"]');
	        if (midoku) {
	            midoku.accessKey = this.config.accesskeyReload;
	            midoku.title = "ヽ(´ー｀)ノロード";
	        }
	    }
	    /**
		 * @param {ParentNode} fragment `fragment`の先頭は通常は空白。ログの一番先頭のみ\<A>
		 * @param {ParentNode} container
		 */ render(fragment, container = this.el) {
	        const { range } = this;
	        let comment;
	        while(comment = this.firstComment(fragment)){
	            const first = /** @type {Text|HTMLAnchorElement} */ fragment.firstChild;
	            /** @type {ParentNode} */ const f = range.extractContents(first, comment);
	            // 以下のように一つずつやるとO(n)
	            // 一気に全部やるとO(n^2)
	            // chrome57の時点で一気にやってもO(n)になってる
	            const a = /** @type {HTMLAnchorElement} */ f.querySelector("a[name]");
	            try {
	                const one = renderPost({
	                    config: this.config,
	                    range: this.range,
	                    a,
	                    f
	                });
	                container.appendChild(one);
	            } catch (e) {
	                console.error(e);
	                container.appendChild(f);
	                this.skipThisPost(a, e);
	            }
	        }
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ firstComment(fragment) {
	        let first = fragment.firstChild;
	        while(first){
	            if (first.nodeType === Node.COMMENT_NODE && first.nodeValue === " ") {
	                return first;
	            }
	            first = first.nextSibling;
	        }
	        return null;
	    }
	    /**
		 * @param {HTMLAnchorElement} a
		 * @param {Error} error
		 */ skipThisPost(a, error) {
	        a.before(/*#__PURE__*/ createNode("div", {
	            className: "qtv-error",
	            children: [
	                /*#__PURE__*/ createNode("p", {
	                    children: [
	                        "エラーが発生したため、この投稿の処理をスキップしました:",
	                        " ",
	                        error.message
	                    ]
	                }),
	                /*#__PURE__*/ createNode("pre", {
	                    children: /*#__PURE__*/ createNode("button", {
	                        type: "button",
	                        onClick: (e)=>{
	                            e.target.parentNode.innerHTML = error.stack;
	                        },
	                        children: "スタックトレース"
	                    })
	                })
	            ]
	        }));
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ finishFooter(fragment) {
	        fragment = this.tweakFooter(fragment);
	        return this.append(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ tweakFooter(fragment) {
	        if (this.needsToTweakFooter()) {
	            return tweakFooter(this.countMessages(), fragment);
	        }
	        return fragment;
	    }
	    needsToTweakFooter() {
	        const config = this.config;
	        return this.ng.isEnabled && config.utterlyVanishNGStack || config.useVanishThread && config.utterlyVanishNGThread;
	    }
	    countMessages() {
	        return this.el.querySelectorAll(".message").length;
	    }
	    showIsSearchingOldLogsExceptFor(ff) {
	        this.prepend(/*#__PURE__*/ createNode("div", {
	            id: "qtv-info",
	            role: "status",
	            "aria-live": "polite",
	            children: /*#__PURE__*/ createNode("strong", {
	                children: [
	                    ff,
	                    "以外の過去ログを検索中..."
	                ]
	            })
	        }));
	    }
	    doneSearchingOldLogs() {
	        this.remove(document.querySelector("#qtv-info"));
	    }
	    /**
		 * @param {ff} ff
		 * @param {FetchResult[]} befores
		 * @param {FetchResult[]} afters
		 */ setBeforesAndAfters(ff, befores, afters) {
	        if (!document.body.querySelector("h1")) {
	            document.body.prepend(/*#__PURE__*/ createNode("h1", {
	                children: ff
	            }));
	        }
	        const h1 = document.querySelector("h1");
	        h1.before(...befores.map((before)=>this.createPseudoPage(before)));
	        this.el.append(...afters.map((after)=>this.createPseudoPage(after)));
	    }
	    /**
		 *
		 * @param {FetchResult} data
		 */ createPseudoPage({ fragment, ff }) {
	        const container = document.createDocumentFragment();
	        if (ff && !fragment.querySelector("h1")) {
	            container.appendChild(/*#__PURE__*/ createNode("h1", {
	                children: ff
	            }));
	        }
	        this.render(fragment, container);
	        // 何か余り物があるかもしれないのでそれも追加
	        container.appendChild(fragment);
	        const numPosts = container.querySelectorAll(".message").length;
	        container.appendChild(numPosts ? /*#__PURE__*/ createNode("h3", {
	            children: [
	                numPosts,
	                "件見つかりました。"
	            ]
	        }) : /*#__PURE__*/ createNode("h3", {
	            children: "指定されたスレッドは見つかりませんでした。"
	        }));
	        return container;
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config, range = new _class()){
	        super(config);
	        this.range = range;
	        this.ng = new NG(config);
	        this.el = document.createElement("main");
	        this.el.id = "qtv-main";
	        /** @type {import("./StackPresenter").default} */ this.presenter = null;
	    }
	}

	class Thread {
	    /**
		 * @param {Post} post
		 */ addPost(post) {
	        this.posts.push(post);
	        this.allPosts.set(post.id, post);
	    }
	    compute() {
	        this.makeFamilyTree();
	        this.makeMissingParent();
	        this.makeMissingGrandparent();
	        if (this.shouldSetRejectLevel()) {
	            this.setRejectLevel();
	        }
	        if (this.shouldRejectPosts()) {
	            this.dropRejectedPosts();
	        }
	    }
	    computeRoots() {
	        return this.getRootCandidates();
	    }
	    /**
		 * 今実際にある`Post`を繋いで親子関係を作る
		 */ makeFamilyTree() {
	        this.posts.filter(Post.wantsParent).forEach(this.adopt, this);
	    }
	    /**
		 * @param {Post} post
		 */ adopt(post) {
	        const parent = this.allPosts.get(post.getKeyForOwnParent());
	        if (!parent) {
	            return;
	        }
	        parent.adoptAsEldestChild(post);
	    }
	    /**
		 * 仮想の親(`MergedPost`)を作り親子関係を作る
		 */ makeMissingParent() {
	        const orphans = this.posts.filter(Post.isOrphan);
	        this.connect(orphans);
	    }
	    /**
		 * @param {Post[]} orphans
		 */ connect(orphans) {
	        orphans.forEach(this.makeParent, this);
	        orphans.forEach(this.adopt, this);
	    }
	    getRootCandidates() {
	        return [
	            ...this.allPosts.values()
	        ].filter((post)=>post.isRoot).sort(this.byID);
	    }
	    /**
		 * 想像上の親(`GhostPost`)を作り親子関係を作る
		 */ makeMissingGrandparent() {
	        const orphans = [
	            ...this.allPosts.values()
	        ].filter(Post.mayHaveParent);
	        this.connect(orphans);
	    }
	    /**
		 * @param {Post} orphan
		 */ makeParent(orphan) {
	        const key = orphan.getKeyForOwnParent();
	        if (!this.allPosts.has(key)) {
	            this.allPosts.set(key, orphan.makeParent());
	        }
	    }
	    /**
		 * @param {Post} l
		 * @param {Post} r
		 */ byID(l, r) {
	        const lid = l.id ? l.id : l.child.id;
	        const rid = r.id ? r.id : r.child.id;
	        return +lid - +rid;
	    }
	    shouldSetRejectLevel() {
	        return +this.getSmallestMessageID() <= this.getThreshold();
	    }
	    getThreshold() {
	        return +this.config.vanishedMessageIDs[0];
	    }
	    getSmallestMessageID() {
	        return [
	            ...this.allPosts.keys()
	        ].sort(this.byNumericalOrder)[0];
	    }
	    /**
		 * @param {string} l
		 * @param {string} r
		 */ byNumericalOrder(l, r) {
	        return +l - +r;
	    }
	    shouldRejectPosts() {
	        return this.config.utterlyVanishMessage;
	    }
	    setRejectLevel() {
	        const vanishedMessageIDs = this.config.vanishedMessageIDs;
	        const roots = this.getRootCandidates();
	        // なぜ逆順なのかは覚えていない
	        for(let i = roots.length - 1; i >= 0; i--){
	            roots[i].setVanishedForRoot(vanishedMessageIDs);
	        }
	    }
	    dropRejectedPosts() {
	        /** @type {Post[]} */ const roots = this.getRootCandidates();
	        for(let i = roots.length - 1; i >= 0; i--){
	            roots[i].drop();
	        }
	    }
	    getDate() {
	        return this.posts[0].date;
	    }
	    getNumber() {
	        if (this.shouldRejectPosts()) {
	            return this.posts.filter(Post.isClean).length;
	        } else {
	            return this.posts.length;
	        }
	    }
	    getID() {
	        return this.posts[0].threadId;
	    }
	    cloneThreadButton() {
	        return this.posts[0].cloneThreadButton();
	    }
	    getSite() {
	        return this.posts[0].site;
	    }
	    /**
		 * live
		 */ isVanished() {
	        return this.config.isVanishedThread(this.getID());
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        this.config = config;
	        /** @type {Post[]} */ this.posts = [];
	        /** @type {Map<string, Post>}} */ this.allPosts = new Map();
	    }
	}

	class ThreadMaker {
	    /**
		 * @param {Post[]} posts
		 */ make(posts) {
	        /** @type {{[id: string]: Thread}} */ const allThreads = Object.create(null);
	        posts.forEach((post)=>{
	            const id = post.threadId;
	            let thread = allThreads[id];
	            if (!thread) {
	                thread = allThreads[id] = new Thread(this.config);
	                this.threads.push(thread);
	            }
	            thread.addPost(post);
	        });
	        this.sortThreads();
	        this.computeThreads();
	        return this.threads;
	    }
	    sortThreads() {
	        if (this.config.threadOrder === "ascending") {
	            this.threads.reverse();
	        }
	    }
	    computeThreads() {
	        this.threads.forEach((thread)=>thread.compute());
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        this.config = config;
	        /** @type {Thread[]} */ this.threads = [];
	    }
	}

	class TreePresenter {
	    /**
		 * @param {import("./TreeView").default} view
		 */ setView(view) {
	        this.view = view;
	    }
	    render() {
	    // empty. ツリーでは逐一処理はしない。
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ async finish(fragment) {
	        this.fragment = fragment;
	        /** @type {Post[]} */ let posts = await this.ctxt.makePosts(fragment, ()=>this.searchOldLogs());
	        posts = this.autovanishThreadsByNG(posts);
	        let threads = new ThreadMaker(this.config).make(posts);
	        threads = this.excludeVanishedThreads(threads);
	        this.showPostCount(threads);
	        const threadsWereShown = this.view.renderThreads(threads);
	        this.suggestLinkToOldLog();
	        this.prepareToggleOriginal(threadsWereShown);
	        await threadsWereShown;
	        this.view.finish(fragment);
	    }
	    /**
		 * @param {Post[]} posts
		 */ autovanishThreadsByNG(posts) {
	        if (this.config.autovanishThread) {
	            const ids = [
	                ...new Set(posts.filter((post)=>post.isNG).map((post)=>post.threadId))
	            ];
	            if (ids.length) {
	                this.config.addVanishedThread(ids);
	            }
	        }
	        return this.config.utterlyVanishNGStack ? posts.filter((post)=>!post.isNG) : posts;
	    }
	    /**
		 * @param {Thread[]} threads
		 */ excludeVanishedThreads(threads) {
	        if (this.config.utterlyVanishNGThread) {
	            return threads.filter((thread)=>!thread.isVanished());
	        } else {
	            return threads;
	        }
	    }
	    /**
		 * @param {Thread[]} threads
		 */ showPostCount(threads) {
	        const numPosts = threads.reduce((total, thread)=>total + thread.getNumber(), 0);
	        this.view.showPostCount(numPosts);
	    }
	    searchOldLogs() {
	        this.view.setInfo(`<strong>${this.ctxt.getLogName()}以外の過去ログを検索中...</strong>`);
	    }
	    /**
		 * @param {Promise} threadsWereShown
		 */ prepareToggleOriginal(threadsWereShown) {
	        const postsArea = this.ctxt.extractOriginalPostsAreaFrom(this.fragment);
	        return threadsWereShown.then(()=>this.appendToggleOriginal(postsArea));
	    }
	    /**
		 * @param {ParentNode} original 元の投稿表示部分
		 */ appendToggleOriginal(original) {
	        if (original.querySelector("a[name]")) {
	            this.view.appendToggleOriginal(original);
	        }
	    }
	    /**
		 * `bbs.log`内をスレッド検索したが、スレッドの先頭が存在しない。
		 */ suggestLinkToOldLog() {
	        const link = this.ctxt.suggestLink(this.fragment);
	        if (link) {
	            this.view.suggestLinkToOldLog(this.ctxt.suggestLink(this.fragment));
	        }
	    }
	    /**
		 * @param {import("Context").default} ctxt
		 * @param {import("Config").default} config
		 */ constructor(ctxt, config){
	        this.ctxt = ctxt;
	        this.config = config;
	        /** @type {ParentNode} */ this.fragment = null;
	    }
	}

	/**
	 * @param {{thread: import("Thread").default, children: any}} props
	 */ function ErrorBoundaryThread({ thread, children }) {
	    try {
	        return index_js.render(children);
	    } catch (error) {
	        console.error(error);
	        return /*#__PURE__*/ createNode("div", {
	            className: "qtv-error",
	            children: [
	                /*#__PURE__*/ createNode("p", {
	                    children: [
	                        "エラーが発生したため、このスレッドをスキップしました: ",
	                        error.message
	                    ]
	                }),
	                /*#__PURE__*/ createNode("pre", {
	                    children: /*#__PURE__*/ createNode("button", {
	                        type: "button",
	                        onClick: (e)=>{
	                            e.target.parentNode.innerHTML = error.stack;
	                        },
	                        children: "スタックトレース"
	                    })
	                }),
	                /*#__PURE__*/ createNode("p", {
	                    children: thread.cloneThreadButton()
	                })
	            ]
	        });
	    }
	}

	const headerStore = vanilla.createStore(()=>({
	        info: "ダウンロード中",
	        /** @type {string} */ suggestLog: null,
	        /** @type {number} */ postCount: null
	    }));

	/**
	 * @typedef {object} Props
	 * @property {import("Config").default} config
	 * @property {import("Thread").default} thread
	 * @property {NG} [ng]
	 * @property {(props: any) => any} renderer
	 * @param {Props} props
	 */ function F2({ config, thread, ng = new NG(config), renderer }) {
	    const MessageAndChildren = renderer;
	    return /*#__PURE__*/ createNode("div", {
	        className: "messages",
	        children: thread.computeRoots().map((post)=>/*#__PURE__*/ createNode(MessageAndChildren, {
	                post: post,
	                config: config,
	                ng: ng
	            }))
	    });
	}

	/**
	 * @typedef {import("Post").default} Post
	 */ /**
	 * @param {object} props
	 * @param {any} props.children
	 * @param {Post} props.post
	 */ function ErrorBoundaryMessage({ children, post }) {
	    try {
	        return index_js.render(children);
	    } catch (error) {
	        console.error(error);
	        return /*#__PURE__*/ createNode("div", {
	            className: "qtv-error",
	            children: [
	                /*#__PURE__*/ createNode("p", {
	                    children: [
	                        "エラーが発生したため、この投稿をスキップしました: ",
	                        error.message
	                    ]
	                }),
	                /*#__PURE__*/ createNode("pre", {
	                    children: /*#__PURE__*/ createNode("button", {
	                        type: "button",
	                        onClick: (e)=>{
	                            e.target.parentNode.innerHTML = error.stack;
	                        },
	                        children: "スタックトレース"
	                    })
	                }),
	                /*#__PURE__*/ createNode("b", {
	                    children: post.title
	                }),
	                " 投稿者：",
	                /*#__PURE__*/ createNode("b", {
	                    children: post.name
	                }),
	                " 投稿日：",
	                post.date,
	                " ",
	                post.cloneResButton(),
	                " ",
	                post.clonePosterButton(),
	                " ",
	                post.cloneThreadButton(),
	                /*#__PURE__*/ createNode("blockquote", {
	                    children: /*#__PURE__*/ createNode("pre", {
	                        dangerouslySetInnerHTML: {
	                            __html: post.text
	                        }
	                    })
	                })
	            ]
	        });
	    }
	}

	class Text extends index_js.Component {
	    render() {
	        const { mayHaveThumbnails } = this.props;
	        const el = this.renderText();
	        if (mayHaveThumbnails) {
	            this.putThumbnails(el);
	        }
	        return el;
	    }
	    renderText() {
	        const { config, className, showAsIs, innerHTML } = this.props;
	        let __html = innerHTML;
	        let truncationNote;
	        if (config.maxLine && !showAsIs) {
	            const maxLine = +config.maxLine;
	            const lines = innerHTML.split("\n");
	            const 省略可能な行数 = Math.max(lines.length - maxLine, 0);
	            if (省略可能な行数) {
	                __html = this.state.truncation ? lines.slice(0, maxLine).join("\n") : __html;
	                truncationNote = /*#__PURE__*/ createNode("div", {
	                    children: this.renderTruncationNoteContent(省略可能な行数)
	                });
	            }
	        }
	        return /*#__PURE__*/ createNode("div", {
	            className: className,
	            dangerouslySetInnerHTML: {
	                __html
	            },
	            children: truncationNote
	        });
	    }
	    /**
		 * @param {number} 省略可能な行数
		 */ renderTruncationNoteContent(省略可能な行数) {
	        /**
			 * @param {MouseEvent} e
			 */ const handleToggleTruncation = (e)=>{
	            e.stopPropagation();
	            this.setState({
	                truncation: !this.state.truncation
	            }, true);
	        };
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                "(",
	                /*#__PURE__*/ createNode(AButton, {
	                    class: "toggleTruncation note",
	                    onclick: handleToggleTruncation,
	                    children: this.state.truncation ? `以下${省略可能な行数}行省略` : "省略する"
	                }),
	                ")"
	            ]
	        });
	    }
	    /**
		 * @param {HTMLElement} el
		 */ putThumbnails(el) {
	        if (!this.props.config.thumbnail) {
	            return;
	        }
	        new Embedder(this.props.config).register(el);
	    }
	    /**
		 * @param {Props}  props
		 */ constructor(props){
	        super(props);
	        this.id += props.post.getUniqueID();
	        this.initState = {
	            truncation: true
	        };
	    }
	}
	class TextTransformer {
	    transform() {
	        this.makeText();
	        this.checkThumbnails();
	        this.checkCharacterEntity();
	        this.characterEntity();
	        return {
	            html: this.text,
	            hasCharacterEntity: this.hasCharacterEntity,
	            mayHaveThumbnails: this.mayHaveThumbnails
	        };
	    }
	    makeText() {
	        const post = this.post;
	        if (!this.showAsIs && !post.isNG) {
	            this.snipOutQuotedArea();
	        }
	        this.formatText();
	        this.trimText();
	        this.specialTextForEmptyText();
	    }
	    formatText() {
	        if (this.post.isNG) {
	            this.text = this.markMatches(this.text, this.ng.words);
	            this.parent = this.markMatches(this.parent, this.ng.words);
	        }
	        if (this.parent.length === 0) {
	            return;
	        }
	        const textLines = this.text.split("\n");
	        const parentTextLines = this.parent.split("\n");
	        parentTextLines.pop();
	        for(let i = 0; i < textLines.length; i++){
	            const line = textLines[i];
	            const parentLine = parentTextLines[i];
	            let quoteClass = "quote";
	            if (parentLine !== undefined) {
	                if (line !== parentLine) {
	                    quoteClass += " modified";
	                }
	                textLines[i] = `<span class="${quoteClass}">${line}</span>`;
	            }
	        }
	        this.text = textLines.join("\n");
	    }
	    /**
		 * @param {string} str
		 * @param {RegExp[]} regexps
		 */ markMatches(str, regexps) {
	        return regexps.reduce((result, regexp)=>this.doMarkMatches(result, regexp), str);
	    }
	    /**
		 * @param {string} str
		 * @param {RegExp} regexp
		 */ doMarkMatches(str, regexp) {
	        let result = "";
	        let match;
	        while((match = regexp.exec(str)) !== null){
	            result += str.slice(0, match.index);
	            const matchStr = match[0];
	            const lines = matchStr.split("\n");
	            for(let i = 0; i < lines.length; i++){
	                result += `<mark class='NGWordHighlight'>${lines[i]}</mark>`;
	                if (i < lines.length - 1) {
	                    result += "\n";
	                }
	            }
	            str = str.slice(match.index + match[0].length);
	        }
	        result += str;
	        return result;
	    }
	    snipOutQuotedArea() {
	        if (this.text.startsWith(this.parent)) {
	            this.text = this.text.slice(this.parent.length);
	            this.parent = "";
	            return;
	        }
	        //右端に空白があるかもしれないので消してからチェック
	        this.parent = this.trimEnds(this.parent);
	        this.text = this.trimEnds(this.text);
	        if (this.text.startsWith(this.parent)) {
	            this.text = this.text.slice(this.parent.length);
	            this.parent = "";
	            return;
	        }
	        /*
	        終わりの空行引用は消してレスする人がいる
	         > PARENT
	         >
	        
	         TEXT
	         上のようになるところを下のようにレスする
	         > PARENT

	         TEXT
	        */ const a = this.parent.replace(/\n(?:&gt; *\n)+\n$/, "\n\n");
	        if (this.text.startsWith(a)) {
	            this.text = this.text.slice(a.length);
	            this.parent = "";
	            return;
	        }
	        //親の親の消す深海式レスのチェック
	        const grandparentDeleted = this.parent.replace(/^&gt; &gt; .*\n/gm, "");
	        if (this.text.startsWith(grandparentDeleted)) {
	            this.text = this.text.slice(grandparentDeleted.length);
	            this.parent = "";
	            return; //NOSONAR
	        }
	    //諦める
	    }
	    /**
		 * @param {string} string
		 */ trimEnds(string) {
	        return string.replace(/^.+$/gm, this.trimEnd);
	    }
	    /**
		 * @param {string} string
		 */ trimEnd(string) {
	        return string.trimEnd();
	    }
	    trimText() {
	        //空白のみの投稿が空投稿になってしまうが、分かりやすくなっていいだろう
	        this.text = this.text.replace(/^\s*\n/, "").trimEnd();
	    }
	    specialTextForEmptyText() {
	        if (this.text.length === 0) {
	            this.text = '<span class="note">(空投稿)</span>';
	        }
	    }
	    checkCharacterEntity() {
	        this.hasCharacterEntity = /&amp;#(?:\d+|x[\da-fA-F]+);/.test(this.text);
	    }
	    characterEntity() {
	        if (this.hasCharacterEntity && this.expandCharacterEntity) {
	            this.text = this.text.replace(/&amp;(#(?:\d+|x[0-9a-fA-F]+);)/g, "&$1");
	        }
	    }
	    checkThumbnails() {
	        this.mayHaveThumbnails = this.text.includes("<a");
	    }
	    /**
		 * @param {object} arg
		 * @param {Post} arg.post
		 * @param {import("Config").default} arg.config
		 * @param {import("NG").default} arg.ng
		 * @param {boolean} arg.showAsIs
		 * @param {boolean} arg.expandCharacterEntity
		 */ constructor({ post, config, ng, showAsIs, expandCharacterEntity }){
	        var _post_parent;
	        this.post = post;
	        this.config = config;
	        this.ng = ng;
	        this.showAsIs = showAsIs;
	        this.text = post.getText();
	        var _post_parent_computeQuotedText;
	        this.parent = (_post_parent_computeQuotedText = (_post_parent = post.parent) == null ? void 0 : _post_parent.computeQuotedText()) != null ? _post_parent_computeQuotedText : "";
	        this.hasCharacterEntity = false;
	        this.expandCharacterEntity = expandCharacterEntity;
	        this.mayHaveThumbnails = false;
	    }
	}

	function TitleAndName({ title, name }) {
	    if (fromKuuhakuToKuuhaku(title, name)) {
	        return null;
	    }
	    return /*#__PURE__*/ createNode(Fragment, {
	        children: [
	            /*#__PURE__*/ createNode("strong", {
	                children: title
	            }),
	            " : ",
	            /*#__PURE__*/ createNode("strong", {
	                dangerouslySetInnerHTML: {
	                    __html: name
	                }
	            }),
	            " #"
	        ]
	    });
	}
	/**
	 * @param {string} title
	 * @param {string} name
	 */ function fromKuuhakuToKuuhaku(title, name) {
	    return (title === "＞　" || title === " ") && name === "　";
	}

	/**
	 * @typedef {object} VanishedState
	 * @property {Set<Post>} vanishedMessages
	 * @property {(post: Post) => boolean} isVanished
	 * @property {(post: Post) => void} add
	 * @property {(post: Post) => void} remove
	 * @property {(post: Post) => boolean} isVanishedInTwoAncestors
	 * @property {() => void} _reset
	 * @typedef {import("zustand").StoreApi<VanishedState>} VanishedStore
	 */ /**
	 *  @type {VanishedStore}
	 */ const vanishedMessagesStore = vanilla.createStore((set, get)=>({
	        vanishedMessages: new Set(),
	        isVanished (post) {
	            return this.vanishedMessages.has(post);
	        },
	        isVanishedInTwoAncestors (post) {
	            var _post_parent;
	            return this.isVanished(post.parent) || this.isVanished((_post_parent = post.parent) == null ? void 0 : _post_parent.parent);
	        },
	        add: (post)=>set((state)=>({
	                    vanishedMessages: new Set(state.vanishedMessages).add(post)
	                })),
	        remove: (post)=>set((state)=>{
	                const vanishedMessages = new Set(state.vanishedMessages);
	                vanishedMessages.delete(post);
	                return {
	                    vanishedMessages
	                };
	            }),
	        _reset: ()=>get().vanishedMessages.clear()
	    }));
	class Message extends index_js.Component {
	    didMount() {
	        this.unsubscribe = vanishedMessagesStore.subscribe((state, prevState)=>{
	            const { post } = this.props;
	            const wasChain = prevState.isVanishedInTwoAncestors(post);
	            const isChain = state.isVanishedInTwoAncestors(post);
	            if (wasChain !== isChain) {
	                this.update();
	            }
	        });
	    }
	    didUnmount() {
	        this.unsubscribe();
	    }
	    /**
		 * @param {string} className
		 */ classNames(className) {
	        return `${className} ${className}_${this.mode()}`;
	    }
	    /**
		 * @returns {string}
		 * @abstract
		 */ mode() {
	        throw new Error("Should be implemented in a subclass");
	    }
	    render() {
	        const handleMouseDown = (/** @type {MouseEvent} */ e)=>{
	            e.stopPropagation();
	            const el = e.target;
	            const id = setTimeout(()=>{
	                this.setState({
	                    showAsIs: !this.state.showAsIs
	                }, true);
	            }, 500);
	            const cancel = function() {
	                clearTimeout(id);
	                el.removeEventListener("mouseup", cancel);
	                el.removeEventListener("mousemove", cancel);
	            };
	            el.addEventListener("mouseup", cancel);
	            el.addEventListener("mousemove", cancel);
	        };
	        let className = this.classNames("message");
	        if (this.props.post.isRead) {
	            className += " read";
	        }
	        const transformer = new this.TextTransformer({
	            post: this.props.post,
	            config: this.props.config,
	            ng: this.props.ng,
	            showAsIs: this.state.showAsIs,
	            expandCharacterEntity: this.state.expandCharacterEntity
	        });
	        const { html: innerHTML, hasCharacterEntity, mayHaveThumbnails } = transformer.transform();
	        const textShouldBeHidden = vanishedMessagesStore.getState().isVanished(this.props.post);
	        const Text = this.Text;
	        var _this_props_post_id;
	        return /*#__PURE__*/ createNode("article", {
	            className: className,
	            id: (_this_props_post_id = this.props.post.id) != null ? _this_props_post_id : "undefined",
	            onMouseDown: handleMouseDown,
	            children: [
	                this.headerContent(hasCharacterEntity),
	                textShouldBeHidden || /*#__PURE__*/ createNode(Text, {
	                    className: this.classNames("text"),
	                    config: this.props.config,
	                    innerHTML: innerHTML,
	                    mayHaveThumbnails: mayHaveThumbnails,
	                    showAsIs: this.state.showAsIs,
	                    post: this.props.post
	                }),
	                this.props.post.env && /*#__PURE__*/ createNode("div", {
	                    className: this.classNames("extra"),
	                    children: this.envContent()
	                })
	            ]
	        });
	    }
	    /**
		 * @param {boolean} hasCharacterEntity
		 */ headerContent(hasCharacterEntity) {
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                this.shouldBeHidden() && this.unfoldButton(),
	                this.renderHeader({
	                    hasCharacterEntity
	                })
	            ]
	        });
	    }
	    /**
		 * NGか個別非表示になっている
		 */ shouldBeHidden() {
	        const notCheckMode = !this.props.config.NGCheckMode;
	        const { post } = this.props;
	        const rejectionLevel = !!this.getRejectionLevel();
	        return post.isNG && notCheckMode || rejectionLevel;
	    }
	    unfoldButton() {
	        const reasons = [];
	        const rejectionLevel = this.getRejectionLevel();
	        if (rejectionLevel > 0) {
	            reasons.push([
	                null,
	                "孫",
	                "子",
	                "個"
	            ][rejectionLevel]);
	        }
	        if (this.props.post.isNG) {
	            reasons.push("NG");
	        }
	        return /*#__PURE__*/ createNode(AButton, {
	            className: "showMessageButton showMessage on",
	            onclick: (/** @type {MouseEvent} */ e)=>{
	                e.stopPropagation();
	                const el = /** @type {Element} */ e.target;
	                el.classList.toggle("on");
	            },
	            children: reasons.join(",")
	        });
	    }
	    getRejectionLevel() {
	        var _post_parent, _post_parent_parent, _post_parent1;
	        const { post } = this.props;
	        return Math.max(post.isVanished ? 3 : 0, ((_post_parent = post.parent) == null ? void 0 : _post_parent.isVanished) ? 2 : 0, ((_post_parent1 = post.parent) == null ? void 0 : (_post_parent_parent = _post_parent1.parent) == null ? void 0 : _post_parent_parent.isVanished) ? 1 : 0);
	    }
	    /**
		 * @param {{hasCharacterEntity: boolean}} param
		 */ renderHeader({ hasCharacterEntity }) {
	        const { post, ng } = this.props;
	        let title = post.title;
	        let name = post.name;
	        if (post.isNG) {
	            title = ng.markHandle(title);
	            name = ng.markHandle(name);
	        }
	        let headerClassName = this.classNames("message-header");
	        if (vanishedMessagesStore.getState().isVanishedInTwoAncestors(post)) {
	            headerClassName += " chainingHidden";
	        }
	        return /*#__PURE__*/ createNode("span", {
	            className: headerClassName,
	            children: [
	                this.resButton(post.cloneResButton()),
	                /*#__PURE__*/ createNode("span", {
	                    className: "message-info",
	                    children: [
	                        /*#__PURE__*/ createNode(TitleAndName, {
	                            title: title,
	                            name: name
	                        }),
	                        post.date
	                    ]
	                }),
	                " ",
	                isUsamin() ? /*#__PURE__*/ createNode("span", {
	                    dangerouslySetInnerHTML: {
	                        __html: post.usaminButtons
	                    }
	                }) : post.cloneResButton(),
	                " ",
	                this.vanishButton(),
	                " ",
	                this.foldButton(),
	                " ",
	                post.clonePosterButton(),
	                " ",
	                hasCharacterEntity && this.characterEntityButton(),
	                " ",
	                post.cloneThreadButton()
	            ]
	        });
	    }
	    /**
		 * @param {HTMLAnchorElement} button
		 */ resButton(button) {
	        button.classList.add("res");
	        button.target = "link";
	        button.textContent = "■";
	        return button;
	    }
	    vanishButton() {
	        if (this.state.retrieveError) {
	            return this.state.retrieveError.message;
	        }
	        const { post } = this.props;
	        if (post.isVanished) {
	            return /*#__PURE__*/ createNode(AButton, {
	                className: "cancelVanishedMessage",
	                onclick: (/** @type {MouseEvent} */ e)=>{
	                    e.stopPropagation();
	                    this.props.post.isVanished = false;
	                    vanishedMessagesStore.getState().remove(post);
	                    this.props.config.removeVanishedMessage(post.id);
	                    this.update();
	                },
	                children: "非表示を解除"
	            });
	        }
	        if (this.props.config.useVanishMessage) {
	            const messageIsVanished = vanishedMessagesStore.getState().isVanished(post);
	            return messageIsVanished ? this.revertVanishMessage() : this.vanishMessage();
	        }
	    }
	    vanishMessage() {
	        return /*#__PURE__*/ createNode(AButton, {
	            className: "vanishMessage",
	            onclick: async ()=>{
	                try {
	                    const { config, post } = this.props;
	                    var _post_id;
	                    const id = (_post_id = post.id) != null ? _post_id : await /** @type {GhostPost} */ post.retrieveIdForcibly();
	                    if (!id) {
	                        throw new Error("最新1000件以内に存在しないため投稿番号が取得できませんでした。過去ログからなら消せるかもしれません");
	                    }
	                    if (id.length > 100) {
	                        throw new Error("この投稿は実在しないようです");
	                    }
	                    vanishedMessagesStore.getState().add(post);
	                    config.addVanishedMessage(post.id);
	                } catch (error) {
	                    this.setState({
	                        retrieveError: error
	                    });
	                }
	                this.update();
	            },
	            children: "消"
	        });
	    }
	    revertVanishMessage() {
	        return /*#__PURE__*/ createNode(AButton, {
	            className: "revertVanishMessage",
	            onclick: ()=>{
	                const { config, post } = this.props;
	                vanishedMessagesStore.getState().remove(post);
	                config.removeVanishedMessage(post.id);
	                this.update();
	            },
	            children: "戻"
	        });
	    }
	    foldButton() {
	        const { post } = this.props;
	        const rejectionLevel = !!this.getRejectionLevel();
	        const on = vanishedMessagesStore.getState().isVanished(post) ? "on" : "";
	        return rejectionLevel && /*#__PURE__*/ createNode(AButton, {
	            className: `fold ${on}`,
	            onclick: ()=>this.update(),
	            children: "畳む"
	        });
	    }
	    characterEntityButton() {
	        return /*#__PURE__*/ createNode(AButton, {
	            className: `toggleCharacterEntity ${this.state.expandCharacterEntity ? "on" : ""}`,
	            onclick: (/** @type {MouseEvent} */ e)=>{
	                e.stopPropagation();
	                this.setState({
	                    expandCharacterEntity: !this.state.expandCharacterEntity
	                });
	                this.update();
	            },
	            children: "文字参照"
	        });
	    }
	    envContent() {
	        return /*#__PURE__*/ createNode("span", {
	            className: "env",
	            children: [
	                "(",
	                this.props.post.env.replace(/<br>/, "/"),
	                ")"
	            ]
	        });
	    }
	    /** @param {T} props */ constructor(props){
	        super(props);
	        const { post } = props;
	        this.id += post.getUniqueID();
	        this.initState = {
	            expandCharacterEntity: props.config.characterEntity,
	            showAsIs: false,
	            retrieveError: null
	        };
	        this.unsubscribe = null;
	    }
	}
	Message.prototype.TextTransformer = TextTransformer;
	Message.prototype.Text = Text;

	/**
	 * @typedef {import("Post").default} Post
	 * @typedef {import("./Message").Props} Props
	 */ /**
	 * @param {Props & {init?: string}} props
	 */ function MessageAndChildrenAscii(props) {
	    const { post } = props;
	    var _props_init;
	    const init = (_props_init = props.init) != null ? _props_init : "";
	    const hasNext = !!post.next;
	    const header = post.isOP() ? "　" : init + (hasNext ? "├" : "└");
	    const text = init + (hasNext ? "｜" : "　") + (post.child ? "｜" : "　");
	    return /*#__PURE__*/ createNode(Fragment, {
	        children: [
	            /*#__PURE__*/ createNode(ErrorBoundaryMessage, {
	                post: post,
	                children: /*#__PURE__*/ createNode(MessageAscii, {
	                    ...props,
	                    header: header,
	                    text: text
	                })
	            }),
	            post.children.map((child)=>/*#__PURE__*/ createNode(MessageAndChildrenAscii, {
	                    ...props,
	                    post: child,
	                    init: init + (hasNext ? "｜" : "　")
	                }))
	        ]
	    });
	}
	/**
	 * @typedef {Props & {text: string, header: string}} PropsWithTextAndHeader
	 */ /**
	 * @augments Message<PropsWithTextAndHeader>
	 */ class MessageAscii extends Message {
	    /** @override */ render() {
	        const text = this.props.text;
	        const textTree = `<span class="a-tree">${text}</span>`;
	        const spacer = this.props.config.spacingBetweenMessages ? `<div class="a-tree spacer">${text}</div>` : "";
	        this.TextTransformer = class extends TextTransformer {
	            transform() {
	                const ret = super.transform();
	                ret.html = spacer + ret.html.replace(/^/gm, textTree);
	                return ret;
	            }
	        };
	        this.Text = class extends Text {
	            /**
				 * @override
				 * @param {number} 省略可能な行数
				 */ renderTruncationNoteContent(省略可能な行数) {
	                return /*#__PURE__*/ createNode(Fragment, {
	                    children: [
	                        /*#__PURE__*/ createNode("span", {
	                            class: "a-tree",
	                            children: text
	                        }),
	                        super.renderTruncationNoteContent(省略可能な行数)
	                    ]
	                });
	            }
	        };
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                super.render(),
	                this.props.config.spacingBetweenMessages && /*#__PURE__*/ createNode("div", {
	                    className: "a-tree spacer",
	                    children: this.props.text
	                })
	            ]
	        });
	    }
	    /** @override */ mode() {
	        return "tree-mode-ascii";
	    }
	    /**
		 * @override
		 * @param {boolean} hasCharacterEntity
		 */ headerContent(hasCharacterEntity) {
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                /*#__PURE__*/ createNode("span", {
	                    class: "a-tree",
	                    children: this.props.header
	                }),
	                super.headerContent(hasCharacterEntity)
	            ]
	        });
	    }
	    /**
		 * @override
		 */ envContent() {
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                /*#__PURE__*/ createNode("span", {
	                    className: "a-tree",
	                    children: this.props.text
	                }),
	                super.envContent()
	            ]
	        });
	    }
	}

	/**
	 * @typedef {import("Post").default} Post
	 * @typedef {import("./Message").Props} Props
	 */ /**
	 * @param {Props & { depth?: number; post: Post; }} props
	 */ function MessageAndChildrenCss(props) {
	    const { post } = props;
	    var _props_depth;
	    const depth = (_props_depth = props.depth) != null ? _props_depth : 1;
	    const children = post.children;
	    const last = children.pop();
	    return /*#__PURE__*/ createNode(Fragment, {
	        children: [
	            children.length ? /*#__PURE__*/ createNode(MessageAndChildrenButLast, {
	                depth: depth,
	                children: [
	                    /*#__PURE__*/ createNode(ErrorBoundaryMessage, {
	                        post: post,
	                        children: /*#__PURE__*/ createNode(MessageCss, {
	                            ...props,
	                            depth: depth
	                        })
	                    }),
	                    children.map((/** @type {any} */ child)=>/*#__PURE__*/ createNode(MessageAndChildrenCss, {
	                            ...props,
	                            post: child,
	                            depth: depth + 1
	                        }))
	                ]
	            }) : /*#__PURE__*/ createNode(ErrorBoundaryMessage, {
	                post: post,
	                children: /*#__PURE__*/ createNode(MessageCss, {
	                    ...props,
	                    depth: depth
	                })
	            }),
	            last && /*#__PURE__*/ createNode(MessageAndChildrenCss, {
	                ...props,
	                post: last,
	                depth: depth + 1
	            })
	        ]
	    });
	}
	/**
	 * @param {{ children: any[]; depth: number; }} props
	 */ function MessageAndChildrenButLast({ children, depth }) {
	    return /*#__PURE__*/ createNode("div", {
	        className: "messageAndChildrenButLast",
	        children: [
	            children,
	            /*#__PURE__*/ createNode("div", {
	                className: "border",
	                style: `left:${depth + 0.5}rem`
	            })
	        ]
	    });
	}
	/**
	 * @typedef {Props & {depth: number}} PropsWithDepth
	 */ /**
	 * @augments Message<PropsWithDepth>
	 */ class MessageCss extends Message {
	    /** @override */ mode() {
	        return "tree-mode-css";
	    }
	    render() {
	        const el = super.render();
	        el.style.marginLeft = this.props.depth + "rem";
	        if (this.props.config.spacingBetweenMessages) {
	            el.classList.add("spacing");
	        }
	        return el;
	    }
	}

	/**
	 * @param {import("Config").default["treeMode"]} treeMode
	 */ function getThreadContent(treeMode) {
	    return ({
	        "tree-mode-css": MessageAndChildrenCss,
	        "tree-mode-ascii": MessageAndChildrenAscii
	    })[treeMode];
	}

	class ThreadRenderer extends index_js.Component {
	    render() {
	        const { config, thread } = this.props;
	        const number = thread.getNumber();
	        if (!number) {
	            return false;
	        }
	        const isVanished = thread.isVanished();
	        const treeMode = this.state.treeMode;
	        const MessageAndChildren = getThreadContent(treeMode);
	        let className = `thread ${treeMode}`;
	        if (isVanished) {
	            className += " NGThread";
	        }
	        const useToggleTreeModeButton = config.toggleTreeMode && config.treeMode === "tree-mode-css";
	        const ng = new NG(config);
	        const handleToggleTreeMode = ()=>{
	            this.setState({
	                treeMode: this.state.treeMode === "tree-mode-css" ? "tree-mode-ascii" : "tree-mode-css"
	            }, true);
	        };
	        /** @type {(e: Event) => Promise<void>} */ const handleToggleVanishThread = async (e)=>{
	            const { config, thread } = this.props;
	            const id = thread.getID();
	            const el = /** @type {Element} */ e.target;
	            const wantsToRevert = el.textContent === "戻";
	            if (wantsToRevert) {
	                await config.removeVanishedThread(id);
	            } else {
	                await config.addVanishedThread(id);
	            }
	            this.update();
	        };
	        return /*#__PURE__*/ createNode("pre", {
	            className: className,
	            role: "group",
	            children: [
	                /*#__PURE__*/ createNode("h2", {
	                    className: "thread-header",
	                    children: [
	                        thread.cloneThreadButton(),
	                        "　",
	                        "更新日：",
	                        thread.getDate(),
	                        "　",
	                        "記事数：",
	                        thread.getNumber(),
	                        useToggleTreeModeButton && /*#__PURE__*/ createNode(Fragment, {
	                            children: [
	                                "　",
	                                /*#__PURE__*/ createNode(AButton, {
	                                    className: "toggleTreeMode",
	                                    onclick: handleToggleTreeMode,
	                                    children: "●"
	                                })
	                            ]
	                        }),
	                        config.useVanishThread && /*#__PURE__*/ createNode(Fragment, {
	                            children: [
	                                "　",
	                                /*#__PURE__*/ createNode(AButton, {
	                                    className: "vanishThread",
	                                    onclick: handleToggleVanishThread,
	                                    children: isVanished ? "戻" : "消"
	                                })
	                            ]
	                        }),
	                        "　",
	                        thread.cloneThreadButton(),
	                        thread.getSite()
	                    ]
	                }),
	                !isVanished && /*#__PURE__*/ createNode(F2, {
	                    thread: thread,
	                    config: config,
	                    ng: ng,
	                    renderer: MessageAndChildren
	                })
	            ]
	        });
	    }
	    /** @param {Props} props */ constructor(props){
	        super(props);
	        this.id += props.thread.getID();
	        this.initState = {
	            treeMode: props.config.treeMode
	        };
	    }
	}

	/**
	 * @param {{original: ParentNode}} props
	 */ function ToggleOriginal({ original }) {
	    let qtvStack = null;
	    const toggleOriginal = (e)=>{
	        qtvStack.hidden = !qtvStack.hidden;
	        e.target.scrollIntoView();
	    };
	    const el = /*#__PURE__*/ createNode("div", {
	        children: [
	            /*#__PURE__*/ createNode("div", {
	                style: "text-align:center",
	                children: /*#__PURE__*/ createNode(AButton, {
	                    class: "toggleOriginal",
	                    onclick: toggleOriginal,
	                    children: "元の投稿の表示する(時間がかかることがあります)"
	                })
	            }),
	            /*#__PURE__*/ createNode("hr", {}),
	            /*#__PURE__*/ createNode("div", {
	                id: "qtv-stack",
	                hidden: true,
	                ref: (ref)=>qtvStack = ref
	            })
	        ]
	    });
	    // @ts-ignore
	    qtvStack.appendChild(original);
	    return el;
	}

	function clickQtvReload(form) {
	    form.querySelector("#qtv-reload").click();
	}

	function reload() {
	    const form = document.getElementById("form");
	    if (!form) {
	        locationReload();
	        return;
	    }
	    const reload = document.getElementById("qtv-reload");
	    if (!reload) {
	        form.insertAdjacentHTML("beforeend", '<input type="submit" id="qtv-reload" name="reload" value="1" style="display:none;">');
	    }
	    clickQtvReload(form);
	}

	/**
	 * @param {object} props
	 * @param {import("Config").default} props.config
	 * @param {string} [props.accesskey]
	 */ function Reload({ config, accesskey = "" }) {
	    if (config.zero) {
	        return /*#__PURE__*/ createNode("input", {
	            type: "button",
	            value: "リロード",
	            class: "mattari",
	            title: "ヽ(´ー｀)ノロード",
	            accessKey: accesskey,
	            onClick: midokureload
	        });
	    } else {
	        return /*#__PURE__*/ createNode(Fragment, {
	            children: [
	                /*#__PURE__*/ createNode("input", {
	                    type: "button",
	                    value: "リロード",
	                    class: "reload",
	                    onClick: reload
	                }),
	                /*#__PURE__*/ createNode("input", {
	                    type: "button",
	                    value: "未読",
	                    class: "mattari",
	                    title: "ヽ(´ー｀)ノロード",
	                    accessKey: accesskey,
	                    onClick: midokureload
	                })
	            ]
	        });
	    }
	}

	class Footer extends index_js.Component {
	    render() {
	        const { config } = this.props;
	        const show = !!(config.numVanishedThreads() || config.numVanishedMessages());
	        const handleClearVanished = async (method)=>{
	            await config[method]();
	            this.update();
	        };
	        return /*#__PURE__*/ createNode("footer", {
	            id: "footer",
	            children: [
	                /*#__PURE__*/ createNode("span", {
	                    children: /*#__PURE__*/ createNode(Reload, {
	                        config: config
	                    })
	                }),
	                /*#__PURE__*/ createNode("span", {
	                    children: [
	                        show && /*#__PURE__*/ createNode("span", {
	                            class: "clearVanishedButtons",
	                            children: [
	                                "非表示解除(",
	                                /*#__PURE__*/ createNode(AButton, {
	                                    onclick: ()=>handleClearVanished("clearVanishedThreadIDs"),
	                                    children: [
	                                        /*#__PURE__*/ createNode("span", {
	                                            class: "count",
	                                            children: config.numVanishedThreads()
	                                        }),
	                                        "スレッド"
	                                    ]
	                                }),
	                                "/",
	                                /*#__PURE__*/ createNode(AButton, {
	                                    onclick: ()=>handleClearVanished("clearVanishedMessageIDs"),
	                                    children: [
	                                        /*#__PURE__*/ createNode("span", {
	                                            class: "count",
	                                            children: config.numVanishedMessages()
	                                        }),
	                                        "投稿"
	                                    ]
	                                }),
	                                ")"
	                            ]
	                        }),
	                        /*#__PURE__*/ createNode(Reload, {
	                            config: config
	                        })
	                    ]
	                })
	            ]
	        });
	    }
	}

	function getCounterAndViewing() {
	    var _document_getElementById;
	    const hr = (_document_getElementById = document.getElementById("form")) == null ? void 0 : _document_getElementById.querySelector("hr");
	    if (hr) {
	        const font = hr.previousElementSibling;
	        if ((font == null ? void 0 : font.tagName) === "FONT") {
	            // eslint-disable-next-line
	            // 2005/03/01 から counter（こわれにくさレベル4）　現在の参加者 : viewing名 (300秒以内)
	            const [, , , counter, , viewing] = font.textContent.match(/[\d,]+/g) || [];
	            return `${counter} / ${viewing} 名`;
	        }
	    }
	    return "";
	}

	class Header extends index_js.Component {
	    didMount() {
	        this.unsubscribe = headerStore.subscribe(()=>{
	            this.update();
	        });
	    }
	    didUnmount() {
	        this.unsubscribe();
	    }
	    render() {
	        function focusV() {
	            setTimeout(function() {
	                document.getElementsByName("v")[0].focus();
	            }, 50);
	        }
	        const { config } = this.props;
	        const ng = new NG(config);
	        const accesskey = config.getAccessKeyForReload();
	        const { postCount, info, suggestLog } = headerStore.getState();
	        return /*#__PURE__*/ createNode("header", {
	            id: "header",
	            children: [
	                /*#__PURE__*/ createNode("span", {
	                    children: [
	                        /*#__PURE__*/ createNode(Reload, {
	                            config: config,
	                            accesskey: accesskey
	                        }),
	                        " ",
	                        getCounterAndViewing(),
	                        " ",
	                        typeof postCount === "number" && /*#__PURE__*/ createNode("span", {
	                            id: "postCount",
	                            children: postCount ? `${postCount}件取得` : "未読メッセージはありません。"
	                        }),
	                        " ",
	                        /*#__PURE__*/ createNode("span", {
	                            id: "info",
	                            dangerouslySetInnerHTML: {
	                                __html: info
	                            }
	                        }),
	                        " ",
	                        suggestLog && /*#__PURE__*/ createNode("a", {
	                            id: "hint",
	                            href: suggestLog,
	                            children: "過去ログを検索する"
	                        })
	                    ]
	                }),
	                !!config.error && /*#__PURE__*/ createNode("span", {
	                    role: "alert",
	                    "aria-live": "polite",
	                    children: [
	                        "設定のロードに失敗したためデフォルト値で表示しています：",
	                        config.error.message
	                    ]
	                }),
	                !!ng.message && /*#__PURE__*/ createNode("span", {
	                    role: "alert",
	                    "aria-live": "polite",
	                    children: ng.message
	                }),
	                /*#__PURE__*/ createNode("span", {
	                    children: [
	                        /*#__PURE__*/ createNode(OpenConfig, {
	                            config: config,
	                            children: "設定"
	                        }),
	                        " ",
	                        /*#__PURE__*/ createNode("a", {
	                            href: "#link",
	                            children: "link"
	                        }),
	                        " ",
	                        /*#__PURE__*/ createNode("a", {
	                            href: "#form",
	                            class: "goToForm",
	                            onClick: focusV,
	                            children: "投稿フォーム"
	                        }),
	                        " ",
	                        /*#__PURE__*/ createNode(Reload, {
	                            config: config
	                        })
	                    ]
	                })
	            ]
	        });
	    }
	}

	class TreeView extends Qtv {
	    setPresenter(presenter) {
	        this.presenter = presenter;
	    }
	    /**
		 * @override
		 */ initializeComponent() {
	        super.initializeComponent();
	        this.prepend(this.el);
	    }
	    /**
		 * @param {ParentNode} original 元の投稿表示部分
		 */ appendToggleOriginal(original) {
	        this.insert(index_js.render(/*#__PURE__*/ createNode(ToggleOriginal, {
	            original: original
	        })));
	    }
	    showPostCount(numPosts) {
	        headerStore.setState({
	            postCount: numPosts
	        });
	    }
	    setInfo(html) {
	        headerStore.setState({
	            info: html
	        });
	    }
	    clearInfo() {
	        headerStore.setState({
	            info: ""
	        });
	    }
	    /**
		 * @param {string} href
		 */ suggestLinkToOldLog(href) {
	        headerStore.setState({
	            suggestLog: href
	        });
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ appendLeftovers(fragment) {
	        this.append(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 * @override
		 */ finish(fragment) {
	        tweakFooter(this.hasMessage(), fragment);
	        this.appendLeftovers(fragment);
	        return super.finish();
	    }
	    hasMessage() {
	        return !!this.content.querySelector(".message:not(.read)");
	    }
	    async renderThreads(threads) {
	        this.setInfo(" - スレッド構築中");
	        let i = 0;
	        const length = threads.length;
	        let deadline = performance.now() + 50;
	        while(i < length){
	            var _navigator_scheduling_isInputPending, _navigator_scheduling;
	            if (((_navigator_scheduling = navigator.scheduling) == null ? void 0 : (_navigator_scheduling_isInputPending = _navigator_scheduling.isInputPending) == null ? void 0 : _navigator_scheduling_isInputPending.call(_navigator_scheduling)) || performance.now() >= deadline) {
	                await this.yieldToMain();
	                deadline = performance.now() + 50;
	                continue;
	            }
	            this.showThread(threads[i]);
	            i++;
	        }
	        this.clearInfo();
	    }
	    yieldToMain() {
	        return new Promise((resolve)=>{
	            setTimeout(resolve, 0);
	        });
	    }
	    /**
		 * @param {Thread} thread
		 */ showThread(thread) {
	        index_js.render(/*#__PURE__*/ createNode(ErrorBoundaryThread, {
	            thread: thread,
	            children: /*#__PURE__*/ createNode(ThreadRenderer, {
	                config: this.config,
	                thread: thread
	            })
	        }), this.content, false);
	    }
	    /**
		 * @param {import("Config").default} config
		 */ constructor(config){
	        super(config);
	        /** @type {import("./TreePresenter").default} */ this.presenter = null;
	        this.el = index_js.render(/*#__PURE__*/ createNode("div", {
	            id: "container",
	            children: [
	                /*#__PURE__*/ createNode(Header, {
	                    config: this.config
	                }),
	                /*#__PURE__*/ createNode("div", {
	                    id: "content"
	                }),
	                /*#__PURE__*/ createNode("hr", {}),
	                /*#__PURE__*/ createNode(Footer, {
	                    config: this.config
	                })
	            ]
	        }));
	        this.content = this.el.querySelector("#content");
	    }
	}

	/**
	 * Configが読み込まれるまで、送られてきたHTMLはここに溜め込み、表示されないようにする。
	 */ class Buffer {
	    /**
		 * @param {{onProgress: (fragment: DocumentFragment) => void, onLoaded: (fragment: DocumentFragment) => void}} listener
		 */ setListener(listener) {
	        this.listener = listener;
	    }
	    /**
		 * @param {HTMLHRElement} hr `BODY`直下の一番目の`HR`。投稿はこの下から始まる。
		 */ onHr(hr) {
	        hr.parentNode.insertBefore(this.marker, hr.nextSibling);
	        this.range.setStartAfter(this.marker);
	    }
	    /**
		 * @param {Node} lastChild 読み込まれた一番最後のノード
		 */ onProgress(lastChild) {
	        if (lastChild !== this.marker) {
	            this.range.setEndAfter(lastChild);
	            this.fragment.appendChild(this.range.extractContents());
	        }
	        // lastChild === markerの場合、つまりbufferに変化がなくてもlistener.renderを呼んでいる。
	        // 無駄に見える。何か理由があってこうした気がするけど覚えていない。
	        this.listener.onProgress(this.fragment);
	    }
	    onLoaded() {
	        this.listener.onLoaded(this.fragment);
	    }
	    constructor(range = document.createRange()){
	        this.range = range;
	        this.fragment = document.createDocumentFragment();
	        /** これを基準にする。これの次が新しいデータ。`hr`の次に要素を挿入しても新しいデータだと勘違いしない */ this.marker = document.createComment("qtv-main-started");
	        this.listener = null;
	    }
	}

	function getTitle() {
	    return document.title;
	}

	class CloseResWindow {
	    onLoaded() {
	        return this.closeIfNeeded();
	    }
	    closeIfNeeded() {
	        return this.gotConfig.then((config)=>{
	            if (this.shouldClose(config)) {
	                this.close();
	            }
	        });
	    }
	    /**
		 * @param {import("Config").default} config
		 * @private
		 */ shouldClose(config) {
	        return config.closeResWindow && getTitle().endsWith(" 書き込み完了");
	    }
	    /** @private */ close() {
	        closeTab();
	    }
	    /**
		 * @param {Promise<import("Config").default>} gotConfig
		 */ constructor(gotConfig){
	        this.gotConfig = gotConfig;
	    }
	}

	const delayPromise = (ms)=>new Promise((resolve)=>{
	        setTimeout(resolve, ms);
	    });
	class DelayNotice {
	    onHr() {
	        return delayPromise(this.timeout_ms).then(this.popup.bind(this));
	    }
	    popup() {
	        if (this.configLoaded) {
	            return;
	        }
	        this.notice = document.createElement("aside");
	        this.notice.id = "qtv-status";
	        this.notice.style.cssText = "position:fixed;top:0px;left:0px;background-color:black;color:white;z-index:1";
	        this.notice.textContent = "設定読込待ち";
	        const body = getBody();
	        body.insertBefore(this.notice, body.firstChild);
	        const removeNotice = ()=>body.removeChild(this.notice);
	        this.gotConfig.then(removeNotice, removeNotice);
	    }
	    constructor(gotConfig, timeout_ms = 700){
	        this.gotConfig = gotConfig;
	        this.timeout_ms = timeout_ms;
	        this.configLoaded = false;
	        this.notice = null;
	        this.gotConfig.then(()=>{
	            this.configLoaded = true;
	        });
	    }
	}

	/**
	 * @returns {Promise<void>}
	 */ function ready$1({ doc = document, capture = false } = {}) {
	    return new Promise(function(resolve) {
	        const readyState = doc.readyState;
	        if (readyState === "complete" || readyState !== "loading" && !doc.documentElement.doScroll) {
	            resolve();
	        } else {
	            doc.addEventListener("DOMContentLoaded", ()=>resolve(), {
	                capture,
	                once: true
	            });
	        }
	    });
	}

	class LoadedObserver {
	    /**
		 * @param {import("./LoadingObserver").Listener} listener
		 */ addListener(listener) {
	        this.listeners.push(listener);
	    }
	    observe() {
	        ready$1().then(()=>{
	            const hr = document.body.querySelector("body > hr");
	            if (hr) {
	                this.notify("onHr", hr);
	                this.notify("onProgress", document.body.lastChild);
	            }
	            this.notify("onLoaded");
	        });
	    }
	    notify(event, arg) {
	        this.listeners.forEach((listener)=>{
	            if (listener[event]) {
	                listener[event](arg);
	            }
	        });
	    }
	    constructor(){
	        /**
			 * @type {import("./LoadingObserver").Listener[]}
			 */ this.listeners = [];
	    }
	}

	function doNothing() {}

	var getInfo = (()=>isGm() ? getGMInfo(GM_info) : isGm4() ? getGMInfo(GM.info) : {
	        platform: "chrome",
	        version: chrome.runtime.getManifest().version
	    });
	const getGMInfo = (/** @type {Tampermonkey.ScriptInfo} */ info)=>({
	        platform: info.scriptHandler + info.version,
	        version: info.script.version
	    });

	/** @type {Error} */ let e;
	/**
	 * @param {Error} error
	 */ function handleError(error) {
	    if (e) {
	        return;
	    }
	    e = error;
	    return ready$1().then(getBody).then(doHandle);
	}
	/**
	 * @param {HTMLBodyElement} body
	 */ function doHandle(body) {
	    const pre = document.createElement("pre");
	    pre.className = "qtv-error";
	    pre.innerHTML = 'くわツリービューの処理を中断しました。表示出来なかった投稿があります。<a href="javascript:;">スタックトレースを表示する</a>';
	    const dStackTrace = document.createElement("pre");
	    dStackTrace.style.display = "none";
	    const info = getInfo();
	    dStackTrace.textContent = `qtvStacktrace/${info.platform}+${info.version}
	${e.name}:
	${e.stack || ""}`;
	    pre.appendChild(dStackTrace);
	    pre.addEventListener("click", showStackTrace);
	    body.insertBefore(pre, body.firstChild);
	    console.error(e);
	    throw e;
	}
	/**
	 * @param {Event} e
	 */ function showStackTrace(e) {
	    const el = /** @type {Element} */ e.target;
	    el.parentNode.querySelector("pre").style.display = null;
	}

	const find = Array.prototype.find;
	const isHR = (node)=>node.nodeName === "HR";
	var findHr = ((mutations)=>{
	    for(let i = 0; i < mutations.length; i++){
	        const mutation = mutations[i];
	        if (mutation.target.nodeName === "BODY") {
	            const element = find.call(mutation.addedNodes, isHR);
	            if (element) {
	                return element;
	            }
	        }
	    }
	});

	var waitForDomContentLoaded = (()=>ready$1({
	        capture: true
	    }));

	class LoadingObserver {
	    makeMutationObserver(callback) {
	        return new MutationObserver(callback);
	    }
	    /**
		 * @param {MutationRecord[]} mutations
		 * @param {MutationObserver} observer
		 */ processRecords(mutations, observer) {
	        observer.disconnect();
	        this.inspect(mutations);
	        this.observe();
	    }
	    /**
		 * @param {MutationRecord[]} mutations
		 */ inspect(mutations) {
	        if (!this.hr) {
	            this.hr = findHr(mutations);
	            if (this.hr) {
	                this.notify("onHr", this.hr);
	            }
	        }
	        if (this.hr) {
	            this.notify("onProgress", this.doc.body.lastChild);
	        }
	    }
	    /**
		 * @param {string} event
		 * @param {ChildNode} [arg]
		 */ notify(event, arg) {
	        for(let i = 0; i < this.listeners.length; i++){
	            const listener = this.listeners[i];
	            if (!listener[event]) {
	                continue;
	            }
	            try {
	                const ret = listener[event](arg);
	                // エラーの処理はここでやるべきではないと思う
	                if (ret && ret.catch) {
	                    ret.catch(this.cleanupAfterError);
	                }
	            } catch (e) {
	                this.cleanupAfterError(e);
	            }
	        }
	    }
	    cleanupAfterError(e) {
	        this.observer.disconnect();
	        this.observer.observe = doNothing;
	        handleError(e);
	    }
	    observe() {
	        if (this.doc.body) {
	            if (this.isFirstCall) {
	                this.first();
	            }
	            this.observer.observe(this.doc.body, {
	                childList: true
	            });
	        } else {
	            this.observer.observe(this.doc.documentElement, {
	                childList: true,
	                subtree: true
	            });
	        }
	        this.isFirstCall = false;
	    }
	    first() {
	        this.hr = this.doc.body.querySelector("body > hr");
	        if (this.hr) {
	            this.notify("onHr", this.hr);
	            this.notify("onProgress", this.doc.body.lastChild);
	        }
	    }
	    /**
		 * @param {Listener} listener
		 */ addListener(listener) {
	        this.listeners.push(listener);
	    }
	    constructor(loaded = waitForDomContentLoaded(), doc = document){
	        /**
			 * @type {Listener[]}
			 */ this.listeners = [];
	        this.doc = doc;
	        this.hr = null;
	        this.observer = this.makeMutationObserver(this.processRecords.bind(this));
	        this.isFirstCall = true;
	        loaded.then(()=>{
	            const records = this.observer.takeRecords();
	            this.observer.disconnect();
	            if (records.length) {
	                this.inspect(records);
	            }
	            this.notify("onLoaded");
	        }).catch(()=>{});
	    }
	}

	/**
	 * @typedef {import("Config").default} Config
	 */ class State {
	    /**
		 * @param {Prestage} _p
		 * @param {Config} _config
		 * @abstract
		 */ configLoaded(_p, _config) {
	        throw new Error(`Undefined: ${this.constructor.name}.configLoaded`);
	    }
	    /**
		 * @param {Prestage} _p
		 * @param {ParentNode} _fragment
		 * @abstract
		 */ onProgress(_p, _fragment) {
	        throw new Error(`Undefined: ${this.constructor.name}.onProgress`);
	    }
	    /**
		 * @param {Prestage} _p
		 * @param {ParentNode} _fragment
		 * @abstract
		 */ onLoaded(_p, _fragment) {
	        throw new Error(`Undefined: ${this.constructor.name}.onLoaded`);
	    }
	}
	/**
	 * 初期ステート
	 * @augments {State}
	 */ class Init extends State {
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {Config} config
		 */ configLoaded(p, config) {
	        p.setReady();
	        p.setConfig(config);
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onProgress(p, fragment) {
	        p.setBuffering();
	        p.onProgress(fragment);
	    }
	    /**
		 * 投稿エリアに入らずに終わった。何もすることがない。set dead
		 * @override
		 * @param {Prestage} p
		 */ onLoaded(p) {
	        p.setDead();
	        p.delegateToUsamin();
	    }
	}
	/**
	 * `Config`未ロード。 投稿エリアに入ってバッファ中。
	 * @augments {State}
	 */ class Buffering extends State {
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {Config} config
		 */ configLoaded(p, config) {
	        p.setConfig(config);
	        p.setRendering();
	        p.prepareRendering();
	    }
	    /**
		 * @override
		 * @param {Prestage} _p
		 * @param {ParentNode} _fragment
		 */ onProgress(_p, _fragment) {
	    // Bufferがバッファリング中
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onLoaded(p, fragment) {
	        p.setWaitingForConfig();
	        p.stash(fragment);
	    }
	}
	/**
	 * `Config`未ロード。bbsのロード終了
	 * @augments {State}
	 */ class WaitingForConfig extends State {
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {Config} config
		 */ configLoaded(p, config) {
	        p.setConfig(config);
	        if (p.shouldQuitHere()) {
	            p.restore();
	            p.setDead();
	            p.delegateToUsamin();
	        } else {
	            p.prepareRendering();
	            p.rewindAndFinish();
	        }
	    }
	}
	/**
	 * `Config`ロード済み。まだ投稿を受信していない。
	 */ class Ready extends State {
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} _fragment
		 */ onProgress(p, _fragment) {
	        if (p.shouldQuitHere()) {
	            p.setDead();
	        } else {
	            p.setRendering();
	            p.prepareRendering();
	        }
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 */ onLoaded(p) {
	        p.setDead();
	        p.delegateToUsamin();
	    }
	}
	class Rendering extends State {
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onProgress(p, fragment) {
	        p.render(fragment);
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onLoaded(p, fragment) {
	        p.finish(fragment);
	        p.setDead();
	    }
	}
	class Dead extends State {
	    /** @override */ configLoaded() {
	    // 終了しているので何もしない。
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onProgress(p, fragment) {
	        p.passThrough(fragment);
	    }
	    /**
		 * @override
		 * @param {Prestage} p
		 * @param {ParentNode} fragment
		 */ onLoaded(p, fragment) {
	        p.passThrough(fragment);
	    }
	}
	const init = new Init();
	const buffering = new Buffering();
	const ready = new Ready();
	const waitingForConfig = new WaitingForConfig();
	const rendering = new Rendering();
	const dead = new Dead();
	class Prestage {
	    prepareRendering() {
	        this.controller.prepareRendering();
	    }
	    /**
		 * @param {Config} config
		 */ setConfig(config) {
	        this.controller.setConfig(config);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ render(fragment) {
	        this.controller.render(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ finish(fragment) {
	        this.controller.finish(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ stash(fragment) {
	        this.controller.stash(fragment);
	    }
	    rewindAndFinish() {
	        this.controller.rewindAndFinish();
	    }
	    restore() {
	        this.controller.restore();
	    }
	    shouldQuitHere() {
	        return this.controller.shouldQuitHere();
	    }
	    delegateToUsamin() {
	        return this.controller.delegateToUsamin();
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ passThrough(fragment) {
	        this.controller.passThrough(fragment);
	    }
	    /**
		 * @param {Config} config
		 */ configLoaded(config) {
	        this.state.configLoaded(this, config);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ onProgress(fragment) {
	        this.state.onProgress(this, fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ onLoaded(fragment) {
	        this.state.onLoaded(this, fragment);
	    }
	    setBuffering() {
	        this.state = buffering;
	    }
	    setWaitingForConfig() {
	        this.state = waitingForConfig;
	    }
	    setReady() {
	        this.state = ready;
	    }
	    setRendering() {
	        this.state = rendering;
	    }
	    setDead() {
	        this.state = dead;
	    }
	    /**
		 * @param {import("./PrestageController").default} controller
		 */ constructor(controller){
	        /** @type {State} */ this.state = init;
	        this.controller = controller;
	    }
	}

	/**
	 * @param {import("Config").default} config
	 */ function shouldQuitHere(config, title = getTitle()) {
	    return isUsamin() && config.viewMode === "s" || title.endsWith(" 個人用環境設定") || title.endsWith(" (エラー)") || title.startsWith("くずはすくりぷと ") || title === "パスワード";
	}

	class PrestageController {
	    /**
		 * @param {Config} config
		 */ setConfig(config) {
	        this.config = config;
	    }
	    prepareRendering() {
	        if (this.config.isTreeView()) {
	            this.qtv = this.factory.treeView(this.config);
	        } else {
	            this.qtv = this.factory.stackView(this.config);
	        }
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ render(fragment) {
	        this.qtv.render(fragment);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ finish(fragment) {
	        this.render(fragment);
	        return this.qtv.finish(fragment).catch(handleError);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ stash(fragment) {
	        this.stasher.stash(fragment);
	        this.stasher.appendTo(document.body);
	    }
	    rewindAndFinish() {
	        const fragment = this.stasher.restore();
	        return this.finish(fragment);
	    }
	    restore() {
	        const fragment = this.stasher.restore();
	        document.body.appendChild(fragment);
	    }
	    shouldQuitHere() {
	        return shouldQuitHere(this.config);
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ passThrough(fragment) {
	        document.body.appendChild(fragment);
	    }
	    /**
		 * 要求の頻度が高すぎてエラーが返ったら、usaminに頼む
		 * `<BODY><H3>要求の頻度が高すぎます:code14</H3></BODY>`
		 */ delegateToUsamin(search = location.search) {
	        var _document_querySelector;
	        if (document.title.endsWith(" (エラー)") && ((_document_querySelector = document.querySelector("h3")) == null ? void 0 : _document_querySelector.textContent.startsWith("要求の頻度が高すぎます"))) {
	            const kwd = new URLSearchParams(search).get("kwd");
	            if (/^misao\d+\.\w+$/.test(kwd)) {
	                document.body.insertAdjacentHTML("beforeend", `<p><a href="http://usamin.elpod.org/cgi-bin/swlog.cgi?y0=on&y1=on&w=${kwd}">http://usamin.elpod.org/cgi-bin/swlog.cgi?y0=on&y1=on&w=${kwd}</a></p>`);
	            }
	        }
	    }
	    /**
		 * @param {import("./Stash").default} stasher
		 * @param {import("./Factory").default} factory
		 */ constructor(stasher, factory){
	        this.stasher = stasher;
	        this.factory = factory;
	        /** @type {Config} */ this.config = null;
	        this.qtv = null;
	    }
	}

	class Stash {
	    stash(buffer) {
	        this.area.appendChild(buffer);
	    }
	    restore() {
	        this.area.parentNode.removeChild(this.area);
	        const range = document.createRange();
	        range.selectNodeContents(this.area);
	        return range.extractContents();
	    }
	    appendTo(node) {
	        node.appendChild(this.area);
	    }
	    constructor(){
	        const area = this.area = document.createElement("div");
	        area.id = "qtv-stash-area";
	        area.hidden = true;
	    }
	}

	class Factory {
	    /**
		 * @param {Promise<Config>} gotConfig
		 */ prestage(gotConfig) {
	        const observer = window.MutationObserver ? new LoadingObserver() : new LoadedObserver();
	        const buffer = new Buffer();
	        const closeResWindow = new CloseResWindow(gotConfig);
	        const notice = new DelayNotice(gotConfig);
	        const stasher = new Stash();
	        const controller = new PrestageController(stasher, this);
	        const prestage = new Prestage(controller);
	        observer.addListener(notice);
	        observer.addListener(buffer);
	        observer.addListener(closeResWindow);
	        buffer.setListener(prestage);
	        gotConfig.then((config)=>prestage.configLoaded(config));
	        observer.observe();
	        return prestage;
	    }
	    /**
		 * @param {Config} config
		 */ treeView(config) {
	        const postParent = new PostParent(config);
	        const ctxt = new Context(config, this.q, postParent);
	        const presenter = new TreePresenter(ctxt, config);
	        const view = new TreeView(config);
	        view.setPresenter(presenter);
	        view.initializeComponent();
	        presenter.setView(view);
	        return presenter;
	    }
	    /**
		 * @param {Config} config
		 */ stackView(config) {
	        const view = new StackView(config);
	        const presenter = new StackPresenter(config, this.q);
	        view.setPresenter(presenter);
	        view.initializeComponent();
	        presenter.setView(view);
	        return presenter;
	    }
	    /**
		 * @param {import("../Query").default} q
		 */ constructor(q){
	        this.q = q;
	    }
	}

	/** @typedef {import("Config").ConfigOptions} ConfigOptions */ var ChromeStorage = {
	    /**
		 * @returns {Promise<Partial<ConfigOptions>>}
		 */ load: function() {
	        // @ts-ignore
	        return this.storage().get(null);
	    },
	    /**
		 * @param {string|string[]} keyOrKeys - 削除したいキー
		 * @returns {Promise<void>}
		 */ remove: function(keyOrKeys) {
	        return new Promise((resolve)=>{
	            this.storage().remove(keyOrKeys, resolve);
	        });
	    },
	    /**
		 * @template {keyof ConfigOptions} T
		 * @param {T} key
		 * @param {ConfigOptions[T]} value
		 * @returns {Promise<void>}
		 */ set: function(key, value) {
	        return new Promise((resolve)=>{
	            this.storage().set({
	                [key]: value
	            }, ()=>resolve());
	        });
	    },
	    /**
		 * @param {Partial<ConfigOptions>} items
		 * @returns {Promise<void>}
		 */ setAll: function(items) {
	        return this.storage().set(items);
	    },
	    /**
		 * @returns {Promise<void>}
		 */ clear: function() {
	        return new Promise((resolve)=>{
	            this.storage().clear(resolve);
	        });
	    },
	    /**
		 * @param {string} key
		 */ get: function(key) {
	        return new Promise((resolve)=>{
	            this.storage().get(key, (item)=>resolve(item[key]));
	        });
	    },
	    storage: function() {
	        return chrome.storage.local;
	    }
	};

	/** @typedef {import("Config").ConfigOptions} ConfigOptions */ var GM4Storage = {
	    /**
		 * @returns {Promise<Partial<ConfigOptions>>}
		 */ async load () {
	        const keys = await this.storage().listValues();
	        return (await Promise.all(keys.map((key)=>this.storage().getValue(key)))).reduce((config, value, i)=>{
	            if (value != null) {
	                config[keys[i]] = JSON.parse(value);
	            } else {
	                this.remove(keys[i]).catch(()=>{});
	            }
	            return config;
	        }, Object.create(null));
	    },
	    /**
		 * @param {string|string[]} keyOrKeys - 削除したいキー
		 * @returns {Promise<void>}
		 */ async remove (keyOrKeys) {
	        const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [
	            keyOrKeys
	        ];
	        await Promise.all(keys.map((key)=>this.storage().deleteValue(key)));
	    },
	    /**
		 * @template {keyof ConfigOptions} T
		 * @param {T} key
		 * @param {ConfigOptions[T]} value
		 * @returns {Promise<void>}
		 */ set: function(key, value) {
	        return this.storage().setValue(key, JSON.stringify(value));
	    },
	    /**
		 * @param {Partial<ConfigOptions>} items
		 * @returns {Promise<void>}
		 */ async setAll (items) {
	        const keys = /** @type {(keyof Partial<ConfigOptions>)[]} */ Object.keys(items);
	        await Promise.all(keys.map((key)=>this.set(key, items[key])));
	    },
	    /**
		 * @returns {Promise<void>}
		 */ async clear () {
	        await this.remove(await this.storage().listValues());
	    },
	    /**
		 * @param {string} key
		 * @returns {Promise<any>}
		 */ async get (key) {
	        const text = await this.storage().getValue(key, "null");
	        return JSON.parse(text);
	    },
	    storage: function() {
	        return GM;
	    }
	};

	/** @typedef {import("Config").ConfigOptions} ConfigOptions */ var GMStorage = {
	    /**
		 * @returns {Promise<Partial<ConfigOptions>>}
		 */ load: function() {
	        return new Promise((resolve)=>{
	            const config = Object.create(null);
	            const keys = GM_listValues();
	            let i = keys.length;
	            while(i--){
	                const key = keys[i];
	                const value = GM_getValue(key);
	                if (value != null) {
	                    config[key] = JSON.parse(value);
	                } else {
	                    GM_deleteValue(key);
	                }
	            }
	            resolve(config);
	        });
	    },
	    /**
		 * @param {string|string[]} keyOrKeys - 削除したいキー
		 * @returns {Promise<void>}
		 */ remove: function(keyOrKeys) {
	        return new Promise((resolve)=>{
	            const keys = Array.isArray(keyOrKeys) ? keyOrKeys : [
	                keyOrKeys
	            ];
	            keys.forEach((key)=>GM_deleteValue(key));
	            resolve();
	        });
	    },
	    /**
		 * @template {keyof ConfigOptions} T
		 * @param {T} key
		 * @param {ConfigOptions[T]} value
		 * @returns {Promise<void>}
		 */ set: function(key, value) {
	        return new Promise((resolve)=>{
	            GM_setValue(key, JSON.stringify(value));
	            resolve();
	        });
	    },
	    /**
		 * @param {Partial<ConfigOptions>} items
		 * @returns {Promise<void>}
		 */ setAll: function(items) {
	        return new Promise((resolve)=>{
	            for (const key of Object.keys(items)){
	                this.set(key, items[key]).catch(()=>{
	                // give up
	                });
	            }
	            resolve();
	        });
	    },
	    /**
		 * @returns {Promise<void>}
		 */ clear: function() {
	        return new Promise((resolve)=>{
	            GM_listValues().forEach(GM_deleteValue);
	            resolve();
	        });
	    },
	    /**
		 * @template {keyof ConfigOptions} T
		 * @param {T} key
		 * @returns {Promise<?ConfigOptions[T]>}
		 */ get: function(key) {
	        return Promise.resolve(JSON.parse(GM_getValue(key, "null")));
	    }
	};

	/** @returns {import("./ConfigStorage").default} */ function getStorage() {
	    return isGm4() ? GM4Storage : isGm() ? GMStorage : ChromeStorage;
	}

	class Config {
	    static async load() {
	        const storage = getStorage();
	        /** @type {Config} */ let config;
	        try {
	            config = new Config(await storage.load(), storage);
	        } catch (error) {
	            config = new ErrorConfig(error);
	        }
	        if (isUsamin()) {
	            config.deleteOriginal = false;
	            config.useVanishMessage = false;
	            config.useVanishThread = false;
	            config.autovanishThread = false;
	        }
	        return config;
	    }
	    /**
		 * @param {propertyOfVanishedIDs} target
		 * @param {string|string[]} id_or_ids
		 * @returns {Promise<void>}
		 */ addID(target, id_or_ids) {
	        let ids = Array.isArray(id_or_ids) ? id_or_ids : [
	            id_or_ids
	        ];
	        this[target] = ids.concat(this[target]);
	        return this._storage.get(target).then((IDs)=>{
	            IDs = Array.isArray(IDs) ? IDs : [];
	            ids = ids.filter((id)=>IDs.indexOf(id) === -1);
	            IDs = IDs.concat(ids).sort((l, r)=>+r - +l);
	            this[target] = IDs;
	            return this._storage.set(target, IDs).then();
	        });
	    }
	    /**
		 * @param {propertyOfVanishedIDs} target
		 * @param {string} id
		 */ removeID(target, id) {
	        return this._storage.get(target).then((ids)=>{
	            ids = Array.isArray(ids) ? ids : [];
	            const index = ids.indexOf(id);
	            if (index !== -1) {
	                ids.splice(index, 1);
	                this[target] = ids;
	                return (ids.length ? this._storage.set(target, ids) : this._storage.remove(target)).then();
	            } else {
	                this[target] = ids;
	            }
	        });
	    }
	    /**
		 * @param {propertyOfVanishedIDs} target
		 */ clearIDs(target) {
	        return this._storage.remove(target).then(()=>{
	            this[target] = [];
	        });
	    }
	    /** @param {string|string[]} id_or_ids */ addVanishedMessage(id_or_ids) {
	        return this.addID("vanishedMessageIDs", id_or_ids);
	    }
	    /** @param {string} id */ removeVanishedMessage(id) {
	        return this.removeID("vanishedMessageIDs", id);
	    }
	    clearVanishedMessageIDs() {
	        return this.clearIDs("vanishedMessageIDs");
	    }
	    numVanishedMessages() {
	        return this.vanishedMessageIDs.length;
	    }
	    /** @param {string|string[]} id_or_ids */ addVanishedThread(id_or_ids) {
	        return this.addID("vanishedThreadIDs", id_or_ids);
	    }
	    /** @param {string} id */ removeVanishedThread(id) {
	        return this.removeID("vanishedThreadIDs", id);
	    }
	    clearVanishedThreadIDs() {
	        return this.clearIDs("vanishedThreadIDs");
	    }
	    numVanishedThreads() {
	        return this.vanishedThreadIDs.length;
	    }
	    clear() {
	        return this._storage.clear().then(()=>{
	            Object.assign(this, Config.prototype);
	        });
	    }
	    /**
		 * @param {Partial<ConfigOptions>} data
		 */ async update(data) {
	        const validKeys = Object.keys(data).filter((key)=>{
	            console.assert(!Array.isArray(Config.prototype[key]), key);
	            const value = Config.prototype[key];
	            const type = typeof value;
	            return type !== "undefined" && type !== "function";
	        });
	        // Config.prototypeとは違うキー
	        const keysToSet = validKeys.filter((key)=>data[key] !== Config.prototype[key]);
	        const newConfig = Object.assign(Object.create(null), ...keysToSet.map((key)=>({
	                [key]: data[key]
	            })));
	        // Config.prototypeと同じキー
	        const keysToRemove = validKeys.filter((key)=>data[key] === Config.prototype[key]);
	        await Promise.all([
	            this._storage.setAll(newConfig),
	            this._storage.remove(keysToRemove)
	        ]);
	        Object.assign(this, newConfig);
	    }
	    toMinimalJson() {
	        const config = this;
	        return JSON.stringify(Object.keys(Config.prototype).filter((key)=>config[key] !== Config.prototype[key]).reduce((newConfig, key)=>Object.assign(newConfig, {
	                [key]: config[key]
	            }), Object.create(null)));
	    }
	    /**
		 * @param {string} id
		 */ isVanishedThread(id) {
	        return this.useVanishThread && this.vanishedThreadIDs.indexOf(id) > -1;
	    }
	    isTreeView() {
	        return this.viewMode === "t";
	    }
	    getAccessKeyForReload() {
	        const accesskey = this.accesskeyReload.trim().charAt(0);
	        return accesskey != null ? accesskey : Config.prototype.accesskeyReload;
	    }
	    /**
		 * @param {Partial<ConfigOptions>} options
		 * @param {import('config/ConfigStorage').default} storage
		 */ constructor(options, storage){
	        /** @type {Error} */ this.error = null;
	        Object.assign(this, options);
	        /** @type {import('config/ConfigStorage').default} */ this._storage = storage;
	    }
	}
	/**
	 * @type {"tree-mode-ascii" | "tree-mode-css"}
	 */ Config.prototype.treeMode = "tree-mode-ascii";
	/**
	 * CSSツリーモードに一時的にASCIIツリーモードに切り替えるボタンをつけるか
	 */ Config.prototype.toggleTreeMode = false;
	/**
	 * リンクにサムネイルや動画音声を埋め込むか
	 */ Config.prototype.thumbnail = true;
	/**
	 * サムネイルをポップアップさせるか
	 */ Config.prototype.thumbnailPopup = true;
	/**
	 * 小町以外の画像動画音声に対応するか
	 */ Config.prototype.popupAny = false;
	/**
	 * ポップアップされた画像の最大幅
	 */ Config.prototype.popupMaxWidth = "";
	/**
	 * ポップアップされた画像の最大高
	 */ Config.prototype.popupMaxHeight = "";
	/**
	 * スレッド内の最新投稿を基準に、古いものを上に、新しいものを下に。
	 * @type {"ascending" | "descending"}
	 */ Config.prototype.threadOrder = "ascending";
	/**
	 * タイトル投稿者に対するNGワード
	 */ Config.prototype.NGHandle = "";
	/**
	 * 本文に対するNGワード
	 */ Config.prototype.NGWord = "";
	Config.prototype.useNG = true;
	/**
	 * NGワードの機能をハイライトとして使うか
	 */ Config.prototype.NGCheckMode = false;
	/**
	 * 投稿間に隙間を開けるか
	 */ Config.prototype.spacingBetweenMessages = false;
	/**
	 * スレッド非表示を使うか
	 */ Config.prototype.useVanishThread = true;
	/**
	 * 非表示に設定されたスレッドのID
	 * @type {string[]}
	 */ Config.prototype.vanishedThreadIDs = [];
	/**
	 * NGワードを含む投稿があった場合、そのスレッドを自動的に非表示にするか
	 */ Config.prototype.autovanishThread = false;
	/**
	 * 非表示になっているスレッドを完全に非表示にするか
	 */ Config.prototype.utterlyVanishNGThread = false;
	/**
	 * 個別投稿非表示を使うか
	 */ Config.prototype.useVanishMessage = false;
	/**
	 * 非表示に設定された投稿のID
	 * @type {string[]}
	 */ Config.prototype.vanishedMessageIDs = [];
	/**
	 * 親子関係のキャッシュの量を増やす
	 */ Config.prototype.vanishMessageAggressive = false;
	/**
	 * 自身、親、祖父母が個別非表示になっている投稿を完全に非表示にする
	 */ Config.prototype.utterlyVanishMessage = false;
	/**
	 * NGにヒットした投稿を完全に非表示にするか。Stackという名前に反して、ツリーモードでもスタックモードでも使うので注意。
	 */ Config.prototype.utterlyVanishNGStack = false;
	Config.prototype.deleteOriginal = true;
	Config.prototype.zero = true;
	Config.prototype.accesskeyReload = "R";
	/**
	 * 投稿欄に飛ぶアクセスキー
	 */ Config.prototype.accesskeyV = "";
	Config.prototype.keyboardNavigation = false;
	/**
	 * キーボードナビゲーションにおける、フォーカスされた投稿の表示位置
	 */ Config.prototype.keyboardNavigationOffsetTop = "200";
	/**
	 * @type {"s"|"t"}
	 */ Config.prototype.viewMode = "t";
	Config.prototype.css = "";
	Config.prototype.shouki = true;
	Config.prototype.closeResWindow = false;
	Config.prototype.maxLine = "";
	/**
	 * targe="link" を常に新しいタブで開く
	 */ Config.prototype.openLinkInNewTab = false;
	Config.prototype.characterEntity = true;
	class ErrorConfig extends Config {
	    async addVanishedMessage() {
	        return;
	    }
	    async removeVanishedMessage() {
	        return;
	    }
	    async clearVanishedMessageIDs() {
	        return;
	    }
	    numVanishedMessages() {
	        return 0;
	    }
	    async addVanishedThread() {
	        return;
	    }
	    async removeVanishedThread() {
	        return;
	    }
	    async clearVanishedThreadIDs() {
	        return;
	    }
	    numVanishedThreads() {
	        return 0;
	    }
	    async clear() {
	        return;
	    }
	    async update() {
	        return;
	    }
	    isVanishedThread() {
	        return false;
	    }
	    isTreeView() {
	        return true;
	    }
	    getAccessKeyForReload() {
	        return this.accesskeyReload;
	    }
	    /**
		 * @param {Error} error
		 */ constructor(error){
	        super({}, null);
	        this.error = error;
	    }
	}

	class ConcurrentFetcherPolicy {
	    /**
		 * @param {ff[]} ffs
		 */ fetch(ffs) {
	        return Promise.all(ffs.map((ff)=>this.fetcher.fetch(ff)));
	    }
	    /**
		 * @param {{fetch: (ff: ff) => Promise<FetchResult>}} fetcher
		 */ constructor(fetcher){
	        this.fetcher = fetcher;
	    }
	}

	const fill = (n)=>n < 10 ? "0" + n : String(n);
	/**
	 * @param {Date} date
	 */ var breakDate = ((date)=>({
	        year: fill(date.getFullYear()),
	        month: fill(date.getMonth() + 1),
	        date: fill(date.getDate())
	    }));

	class RecentOldLogNames {
	    /**
		 * @param {ff} pivot - ff 最近7つのログからこれを除くログ名を返す
		 */ generate(pivot) {
	        const dates = this.getThese7LogNames(pivot);
	        /** @type {ff[]} */ const afters = [];
	        /** @type {ff[]} */ const befores = [];
	        for (const date of dates){
	            const diff = this.asInt(date) - this.asInt(pivot);
	            if (diff < 0) {
	                befores.unshift(date);
	            } else if (diff > 0) {
	                afters.unshift(date);
	            }
	        }
	        return {
	            afters,
	            befores
	        };
	    }
	    /**
		 * くずはすくりぷとの過去ログ保存日数はデフォルトで5日間だし、
		 * 任意の日数を設定できるので7日間/7ヶ月間の決め打ちは良くない。
		 * 保存方法を月毎にしている場合はログの自動消去が起こらないため無限に溜まる。
		 * @param {ff} pivot
		 * @returns {ff[]}
		 */ getThese7LogNames(pivot) {
	        /** @type {ff[]} */ const dates = [];
	        const back = new Date(this.now);
	        if (this.logsAreSavedDaily(pivot)) {
	            for(let i = 0; i < 7; i++){
	                const { year, month, date } = breakDate(back);
	                dates.push(/** @type {ff} */ `${year}${month}${date}.dat`);
	                back.setDate(back.getDate() - 1);
	            }
	        } else {
	            for(let i = 0; i < 7; i++){
	                const { year, month } = breakDate(back);
	                dates.push(/** @type {ff} */ `${year}${month}.dat`);
	                back.setMonth(back.getMonth() - 1);
	            }
	        }
	        return dates;
	    }
	    /**
		 * @param {ff} pivot
		 */ logsAreSavedDaily(pivot) {
	        return pivot.length === 12;
	    }
	    /**
		 * @param {string} string
		 */ asInt(string) {
	        return Number.parseInt(string, 10);
	    }
	    constructor(now = new Date()){
	        this.now = now;
	    }
	}

	class StoppableSequentialFetcherPolicy {
	    /**
		 * @param {ff[]} ffs
		 * @param {ParentNode} container
		 */ async fetch(ffs, container) {
	        ffs.reverse();
	        /** @type {FetchResult[]} */ const results = [];
	        for (const ff of ffs){
	            if (this.shouldStop(container)) {
	                return results;
	            }
	            const result = await this.fetcher.fetch(ff);
	            results.unshift(result);
	            container = result.fragment;
	        }
	        return results;
	    }
	    /**
		 * @param {ParentNode} container
		 */ shouldStop(container) {
	        return this.fetcher.shouldStop(container);
	    }
	    /**
		 * @param {{fetch: (ff: ff) => Promise<FetchResult>, shouldStop: (container: ParentNode) => boolean}} fetcher
		 */ constructor(fetcher){
	        this.fetcher = fetcher;
	    }
	}

	class Query {
	    /**
		 * @param {string} search
		 */ static parse(search) {
	        if (typeof search === "object") {
	            return search;
	        }
	        const obj = Object.create(null);
	        const kvs = search.substring(1).split("&");
	        kvs.forEach(function(kv) {
	            obj[kv.split("=")[0]] = kv.split("=")[1];
	        });
	        return obj;
	    }
	    /**
		 * @param {string} key
		 */ get(key) {
	        return this.q[key];
	    }
	    /**
		 * @param {string} key
		 * @param {string} value
		 */ set(key, value) {
	        this.q[key] = value;
	    }
	    /**
		 * 過去ログでスレッドボタンがあるか？
		 * @returns {boolean}
		 */ shouldHaveValidPosts() {
	        if (this.q.m !== "g") {
	            return false;
	        }
	        // html形式にはボタンが付かない
	        if (/^\d+\.html?$/.test(this.q.e)) {
	            return false;
	        }
	        // 検索ボタンを押した && `引用機能`にチェックが入っている
	        return !!(this.q.sv && this.q.btn);
	    }
	    isNormalMode() {
	        return !this.q.m;
	    }
	    /**
		 * @param {ParentNode} fragment
		 */ suggestLink(fragment) {
	        if (this.searchedBbsLogButOpNotFound(fragment)) {
	            const { year, month, date } = breakDate(new Date());
	            return `${this.href}&ff=${year}${month}${date}.dat`;
	        }
	    }
	    /**
		 * `bbs.log`内をスレッド検索し、スレッドの先頭が存在ない。
		 * @param {ParentNode} fragment
		 */ searchedBbsLogButOpNotFound(fragment) {
	        return this.isSearchingBbsLogForThread() && !this.hasOP(fragment);
	    }
	    /**
		 * 通常モードからスレッドボタンを押した場合
		 * @private
		 */ isSearchingBbsLogForThread() {
	        return this.q.m === "t" && !this.q.ff && /^[1-9]\d*$/.test(this.q.s);
	    }
	    shouldAppendFf() {
	        return this.q.m === "t" || this.q.m === "s" || // 過去ログのスレッドボタンにはffがつくはずだが、
	        // なぜかスレッドOPのスレッドボタンにはffがつかない
	        this.q.m === "g";
	    }
	    /** ログ補完するべきか */ shouldFetch() {
	        return this.shouldSearchLog() || this.isFromKomachi();
	    }
	    /**
		 * 過去ログ検索して、スレッドボタンを押した。くずはすくりぷとはスレッドの投稿を日付を跨いで探してくれない。
		 * @returns {boolean}
		 */ shouldSearchLog() {
	        return this.q.m === "t" && /^\d+\.dat$/.test(this.q.ff) && /^[1-9]\d*$/.test(this.q.s);
	    }
	    /**
		 * 小町のlogボタンから来た？
		 */ isFromKomachi() {
	        // referrerを切ってる人もいるだろうし、referrerのチェックはない方がいい
	        // かもしれないが、わざわざ検索窓で一日だけにチェックを入れて小町のファ
	        // イルを検索する人は、複数日検索されると困ったりするんだろうか。
	        return /^https?:\/\/misao\.mixh\.jp\/c\/upload\.cgi/.test(this.referrer) && this.q.m === "g" && /\bmisao\d+\.\w+$/.test(this.q.kwd);
	    }
	    /**
		 * @param {ParentNode} fragment - この中にOPがあれば遡らない
		 * @returns {Promise<{afters: FetchResult[], befores: FetchResult[]}>}
		 */ async fetchOldLogs(fragment) {
	        if (this.isFromKomachi()) {
	            return this.fetchOldLogsForMisaoFile();
	        } else {
	            return this.fetchOldLogsForThread(fragment);
	        }
	    }
	    async fetchOldLogsForMisaoFile() {
	        const befores = [];
	        const { afters: afterDates } = new RecentOldLogNames().generate(this.getCurrentBbsLogName());
	        if (!afterDates.length) {
	            return {
	                afters: [],
	                befores
	            };
	        }
	        const { year, month, day } = breakDate(new Date());
	        if (this.q[`chk${year}${month}${day}.dat`]) {
	            return {
	                afters: [],
	                befores
	            };
	        }
	        const q = new URLSearchParams(this.q);
	        q.delete("e");
	        for (const key of q.keys()){
	            if (key.startsWith("chk")) {
	                q.delete(key);
	            }
	        }
	        for (const date of afterDates){
	            q.append(`chk${date}`, "checked");
	        }
	        await new Promise((r)=>{
	            setTimeout(r, 1000);
	        });
	        return {
	            afters: [
	                {
	                    fragment: await ajax({
	                        data: q
	                    })
	                }
	            ],
	            befores
	        };
	    }
	    /**
		 * @param {ParentNode} fragment - この中にOPがあれば遡らない
		 * @returns {Promise<{afters: FetchResult[], befores: FetchResult[]}>}
		 */ async fetchOldLogsForThread(fragment) {
	        const { afters: afterDates, befores: beforeDates } = new RecentOldLogNames().generate(this.getCurrentBbsLogName());
	        const after = this.concurrent(afterDates);
	        const before = this.sequence(beforeDates, fragment);
	        return Promise.all([
	            after,
	            before
	        ]).then(([afters, befores])=>{
	            return {
	                afters,
	                befores
	            };
	        });
	    }
	    /**
		 * @param {ff[]} afters
		 */ async concurrent(afters) {
	        return this.concurrentFetcherPolicy().fetch(afters);
	    }
	    concurrentFetcherPolicy() {
	        return new ConcurrentFetcherPolicy(this);
	    }
	    /**
		 * @param {ff[]} befores
		 * @param {ParentNode} container
		 */ sequence(befores, container) {
	        return this.sequentialFetcherPolicy().fetch(befores, container);
	    }
	    sequentialFetcherPolicy() {
	        return new StoppableSequentialFetcherPolicy(this);
	    }
	    /**
		 * @param {ParentNode} container
		 */ shouldStop(container) {
	        return this.hasOP(container);
	    }
	    /**
		 * スレッド検索中で`container`にスレッドの先頭が含まれているなら`true`、それ以外は`false`
		 * @param {ParentNode} container
		 */ hasOP(container) {
	        return this.q.m === "t" && !!container.querySelector(this.selectorForOP());
	    }
	    selectorForOP() {
	        if (this.q.m === "t") {
	            return 'a[name="' + this.q.s + '"]';
	        }
	    }
	    /**
		 * @param {ff} ff
		 */ async fetch(ff) {
	        const fragment = await ajax({
	            data: this.searchParamsFor(ff)
	        });
	        return {
	            ff,
	            fragment
	        };
	    }
	    /**
		 * @param {ff} ff
		 */ searchParamsFor(ff) {
	        if (this.q.m !== "t") {
	            throw new Error("m=t以外で呼ばない");
	        }
	        const q = new URLSearchParams(this.q);
	        q.set("ff", ff);
	        return q;
	    }
	    /**
		 * @returns {ff}
		 */ getCurrentBbsLogName() {
	        if (this.q.m === "g") {
	            if (this.q.e) {
	                return this.q.e;
	            } else {
	                return /** @type {ff} */ Object.keys(this.q).find((key)=>/^chk\d+\.dat$/.test(key)).replace(/^chk/, "");
	            }
	        } else if (this.q.m === "t") {
	            return this.q.ff;
	        }
	        throw new Error();
	    }
	    /** @public */ getLogName() {
	        return this.getCurrentBbsLogName();
	    }
	    constructor(location = window.location, referrer = document.referrer){
	        /** @type {SearchOldLog|SearchForThread|Other} */ this.q = Query.parse(location.search);
	        this.search = location.search;
	        this.href = location.href;
	        this.referrer = referrer;
	    }
	}

	/**
	 * 内容欄にフォーカスして表示
	 * @param {HTMLBodyElement} body
	 */ function tweak(body) {
	    const v = body.querySelector("textarea");
	    if (v) {
	        v.focus() // Firefox needs focus before setSelectionRange.
	        ;
	        v.scrollIntoView();
	        // 内容を下までスクロール firefox
	        v.setSelectionRange(v.textLength, v.textLength);
	        // 内容を下までスクロール chrome
	        v.scrollTop = v.scrollHeight;
	    }
	}

	var tweakResWindow = (()=>ready$1().then(getBody).then(tweak));

	class Main {
	    static main(q = new Query()) {
	        switch(q.get("m")){
	            case "f":
	                tweakResWindow();
	                return;
	            case "l":
	            case "c":
	                return;
	            case "g":
	                if (!q.shouldHaveValidPosts()) {
	                    return;
	                }
	        }
	        const factory = new Factory(q);
	        factory.prestage(Config.load());
	    }
	}

	Main.main();

})(nanoJSX, zustandVanilla);
