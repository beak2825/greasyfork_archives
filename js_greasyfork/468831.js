// ==UserScript==
// @name           HTML2FB2Lib
// @name:ru        HTML2FB2Lib
// @namespace      90h.yy.zz
// @version        0.11.0
// @author         Ox90
// @description    This library is designed to convert HTML to FB2.
// @description:ru Эта библиотека предназначена для конвертирования HTML в FB2.
// @license        MIT
// ==/UserScript==

class FB2Parser {
  run(fb2doc, htmlNode, fromNode) {
    this._stop = null;
    this._notes = [];
    const res = this.parse(htmlNode, fromNode);
    this._notes.forEach(note => fb2doc.notes.push(note));
    delete this._notes;
    return res;
  }

  parse(htmlNode, fromNode) {
    const that = this;
    function _parse(node, from, fb2el, depth) {
      let n = from || node.firstChild;
      while (n) {
        const nn = that.startNode(n, depth, fb2el);
        if (nn) {
          const f = that.processElement(FB2Element.fromHTML(nn, false), depth);
          if (f) {
            if (fb2el) fb2el.children.push(f);
            _parse(nn, null, f, depth + 1);
          }
          that.endNode(nn, depth);
        }
        if (that._stop) break;
        n = n.nextSibling;
      }
    }
    _parse(htmlNode, fromNode, null, 0);
    return this._stop;
  }

  startNode(node, depth, fb2to) {
    return node;
  }

  processElement(fb2el, depth) {
    if (fb2el instanceof FB2Note) this._notes.push(fb2el);
    return fb2el;
  }

  endNode(node, depth) {
  }
}

class FB2AnnotationParser extends FB2Parser {
  run(fb2doc, htmlNode, fromNode) {
    this._binaries = [];
    const res = super.run(fb2doc, htmlNode, fromNode);
    fb2doc.annotation = this._annotation;
    if (fb2doc.annotation) {
      fb2doc.annotation.normalize();
      this._binaries.forEach(bin => fb2doc.binaries.push(bin));
      this._binaries = null;
    }
    return res;
  }

  parse(htmlNode, fromNode) {
    this._annotation = new FB2Annotation();
    const res = super.parse(htmlNode, fromNode);
    if (!this._annotation.children.length) this._annotation = null;
    return res;
  }

  processElement(fb2el, depth) {
    if (fb2el) {
      if (depth === 0) this._annotation.children.push(fb2el);
      if (fb2el instanceof FB2Image) this._binaries.push(fb2el);
    }
    return super.processElement(fb2el, depth);
  }
}

class FB2ChapterParser extends FB2Parser {
  run(fb2doc, htmlNode, title, fromNode) {
    this._binaries = [];
    const res = this.parse(title, htmlNode, fromNode);
    this._chapter.normalize();
    fb2doc.chapters.push(this._chapter);
    this._binaries.forEach(bin => fb2doc.binaries.push(bin));
    this._binaries = null;
    return res;
  }

  parse(title, htmlNode, fromNode) {
    this._chapter = new FB2Chapter(title);
    return super.parse(htmlNode, fromNode);
  }

  processElement(fb2el, depth) {
    if (fb2el) {
      if (depth === 0) this._chapter.children.push(fb2el);
      if (fb2el instanceof FB2Image) this._binaries.push(fb2el);
    }
    return super.processElement(fb2el, depth);
  }
}

class FB2Document {
  constructor() {
    this.notes = [];
    this.binaries = [];
    this.bookAuthors = [];
    this.annotation = null;
    this.genres = [];
    this.keywords = [];
    this.chapters = [];
    this.history = [];
    this.xmldoc = null;
    this._parsers = new Map();
  }

  toString() {
    this._ensureXMLDocument();
    const root = this.xmldoc.documentElement;
    this._markNotes();
    this._markBinaries();
    root.appendChild(this._makeDescriptionElement());
    root.appendChild(this._makeBodyElement());
    if (this.notes.length) root.appendChild(this._makeNotesElement());
    this._makeBinaryElements().forEach(el => root.appendChild(el));
    const res = (new XMLSerializer()).serializeToString(this.xmldoc);
    this.xmldoc = null;
    return res;
  }

  createElement(name) {
    this._ensureXMLDocument();
    return this.xmldoc.createElementNS(this.xmldoc.documentElement.namespaceURI, name);
  }

  createTextNode(value) {
    this._ensureXMLDocument();
    return this.xmldoc.createTextNode(value);
  }

  createDocumentFragment() {
    this._ensureXMLDocument();
    return this.xmldoc.createDocumentFragment();
  }

  bindParser(parserId, parser) {
    if (!parser && !parserId) {
      this._parsers.clear();
      return;
    }
    this._parsers.set(parserId, parser);
  }

  parse(parserId, ...args) {
    const parser = this._parsers.get(parserId);
    if (!parser) throw new Error(`Unknown parser id: ${parserId}`);
    return parser.run(this, ...args);
  }

  _ensureXMLDocument() {
    if (!this.xmldoc) {
      this.xmldoc = new DOMParser().parseFromString(
        '<?xml version="1.0" encoding="UTF-8"?><FictionBook xmlns="http://www.gribuser.ru/xml/fictionbook/2.0"/>',
        "application/xml"
      );
      this.xmldoc.documentElement.setAttribute("xmlns:l", "http://www.w3.org/1999/xlink");
    }
  }

  _makeDescriptionElement() {
    const desc = this.createElement("description");
    // title-info
    const t_info = this.createElement("title-info");
    desc.appendChild(t_info);
    //--
    const ch_num = t_info.children.length;
    this.genres.forEach(gi => {
      if (gi instanceof FB2Genre) {
        t_info.appendChild(gi.xml(this));
      } else if (typeof(gi) === "string") {
        (new FB2GenreList(gi)).forEach(g => t_info.appendChild(g.xml(this)));
      }
    });
    if (t_info.children.length === ch_num) t_info.appendChild((new FB2Genre("network_literature")).xml(this));
    //--
    (this.bookAuthors.length ? this.bookAuthors : [ new FB2Author("Неизвестный автор") ]).forEach(a => {
      t_info.appendChild(a.xml(this));
    });
    //--
    t_info.appendChild((new FB2Element("book-title", this.bookTitle)).xml(this));
    //--
    if (this.annotation) t_info.appendChild(this.annotation.xml(this));
    //--
    let keywords = null;
    if (Array.isArray(this.keywords) && this.keywords.length) {
      keywords = this.keywords.join(", ");
    } else if (typeof(this.keywords) === "string" && this.keywords.trim()) {
      keywords = this.keywords.trim();
    }
    if (keywords) t_info.appendChild((new FB2Element("keywords", keywords)).xml(this));
    //--
    if (this.bookDate) {
      const el = this.createElement("date");
      el.setAttribute("value", FB2Utils.dateToAtom(this.bookDate));
      el.textContent = this.bookDate.getFullYear();
      t_info.appendChild(el);
    }
    //--
    if (this.coverpage) {
      const el = this.createElement("coverpage");
      (Array.isArray(this.coverpage) ? this.coverpage : [ this.coverpage ]).forEach(img => {
        el.appendChild(img.xml(this));
      });
      t_info.appendChild(el);
    }
    //--
    const lang = this.createElement("lang");
    lang.textContent = "ru";
    t_info.appendChild(lang);
    //--
    if (this.sequence) {
      const el = this.createElement("sequence");
      el.setAttribute("name", this.sequence.name);
      if (this.sequence.number) el.setAttribute("number", this.sequence.number);
      t_info.appendChild(el);
    }
    // document-info
    const d_info = this.createElement("document-info");
    desc.appendChild(d_info);
    //--
    d_info.appendChild((new FB2Author("Ox90")).xml(this));
    //--
    if (this.programName) d_info.appendChild((new FB2Element("program-used", this.programName)).xml(this));
    //--
    d_info.appendChild((() => {
      const f_time = new Date();
      const el = this.createElement("date");
      el.setAttribute("value", FB2Utils.dateToAtom(f_time));
      el.textContent = f_time.toUTCString();
      return el;
    })());
    //--
    if (this.sourceURL) {
      d_info.appendChild((new FB2Element("src-url", this.sourceURL)).xml(this));
    }
    //--
    d_info.appendChild((new FB2Element("id", this._genBookId())).xml(this));
    //--
    d_info.appendChild((new FB2Element("version", "1.0")).xml(this));
    //--
    if (this.history.length) {
      const hs = this.createElement("history");
      d_info.appendChild(hs);
      this.history.forEach(it => hs.appendChild((new FB2Paragraph(it)).xml(this)));
    }
    //--
    return desc;
  }

  _makeBodyElement() {
    const body = this.createElement("body");
    if (this.bookTitle || this.bookAuthors.length) {
      const title = this.createElement("title");
      body.appendChild(title);
      if (this.bookAuthors.length) title.appendChild((new FB2Paragraph(this.bookAuthors.join(", "))).xml(this));
      if (this.bookTitle) title.appendChild((new FB2Paragraph(this.bookTitle)).xml(this));
    }
    this.chapters.forEach(ch => body.appendChild(ch.xml(this)));
    return body;
  }

  _markNotes() {
    let idx = 0;
    this.notes.forEach(note => {
      if (!note.id) note.id = "note" + (++idx);
      if (!note.title) note.title = idx.toString();
    });
  }

  _makeNotesElement() {
    const body = this.createElement("body");
    body.setAttribute("name", "notes");
    const title = this.createElement("title");
    title.appendChild(this.createElement("p")).textContent = "Примечания";
    body.append(title);
    this.notes.forEach(note => body.append(note.xmlSection(this)));
    return body;
  }

  _markBinaries() {
    let idx = 0;
    this.binaries.forEach(img => {
      if (!img.id) img.id = "image" + (++idx) + img.suffix();
    });
  }

  _makeBinaryElements() {
    return this.binaries.reduce((list, img) => {
      if (img.value) list.push(img.xmlBinary(this));
      return list;
    }, []);
  }

  _genBookId() {
    let str = this.sourceURL || this.bookTitle || "";
    let hash = 0;
    const slen = str.length;
    for (let i = 0; i < slen; ++i) {
      const ch = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + ch;
      hash = hash & hash; // Convert to 32bit integer
    }
    return (this.idPrefix || "h2f2l_") + Math.abs(hash).toString() + (hash > 0 ? "1" : "");
  }
}

class FB2Element {
  constructor(name, value) {
    this.name = name;
    this.value = value !== undefined ? value : null;
    this.children = [];
  }

  static fromHTML(node, recursive) {
    let fb2el = null;
    const names = new Map([
      [ "U", "emphasis" ], [ "EM", "emphasis" ], [ "EMPHASIS", "emphasis" ], [ "I", "emphasis" ],
      [ "S", "strikethrough" ], [ "DEL", "strikethrough" ], [ "STRIKE", "strikethrough" ],
      [ "STRONG", "strong" ], [ "B", "strong" ], [ "SUB", "sub" ], [ "SUP", "sup" ],
      [ "SCRIPT", null ], [ "#comment", null ]
    ]);
    const inline = new Set([ "emphasis", "strikethrough", "strong", "sub", "sup" ]);
    const node_name = node.nodeName;
    if (names.has(node_name)) {
      const name = names.get(node_name);
      if (!name) return null;
      fb2el = inline.has(name) ? new FB2InlineMarkup(name) : new FB2Element(name);
    } else {
      switch (node_name) {
        case "#text":
          return new FB2Text(node.textContent);
        case "SPAN":
          fb2el = new FB2Text();
          break;
        case "P":
        case "LI":
          fb2el = new FB2Paragraph();
          break;
        case "SUBTITLE":
          fb2el = new FB2Subtitle();
          break;
        case "BLOCKQUOTE":
          fb2el = new FB2Cite();
          break;
        case "A":
          fb2el = new FB2Link(node.href || node.getAttribute("l:href"));
          break;
        case "OL":
          fb2el = new FB2OrderedList();
          break;
        case "UL":
          fb2el = new FB2UnorderedList();
          break;
        case "BR":
          return new FB2EmptyLine();
        case "HR":
          return new FB2Paragraph("---");
        case "IMG":
          return new FB2Image(node.src);
        default:
          return new FB2UnknownNode(node);
      }
    }
    if (recursive) fb2el.appendContentFromHTML(node);
    return fb2el;
  }

  hasValue() {
    return ((this.value !== undefined && this.value !== null) || !!this.children.length);
  }

  setContentFromHTML(data, fb2doc, log) {
    this.children = [];
    this.appendContentFromHTML(data, fb2doc, log);
  }

  appendContentFromHTML(data, fb2doc, log) {
    for (const node of data.childNodes) {
      let fe = FB2Element.fromHTML(node, true);
      if (fe) this.children.push(fe);
    }
  }

  normalize() {
    const _normalize = function(list) {
      let done = true;
      let res_list = list.reduce((accum, cur_el) => {
        accum.push(cur_el);
        const tmp_ch = cur_el.children;
        cur_el.children = [];
        tmp_ch.forEach(el => {
          if (
            (
              (el instanceof FB2Paragraph || el instanceof FB2EmptyLine) &&
              (!(cur_el instanceof FB2Chapter || cur_el instanceof FB2Annotation || cur_el instanceof FB2Cite || cur_el.name === "title"))
            ) || (
              (el instanceof FB2Cite) &&
              (!(cur_el instanceof FB2Chapter || cur_el instanceof FB2Annotation))
            ) || (
              (el instanceof FB2Subtitle) &&
              (!(cur_el instanceof FB2Chapter || cur_el instanceof FB2Cite))
            )
          ) {
            // Вытолкнуть элемент вверх, разбив текущий элемент на две части
            const nm = cur_el.name;
            if (cur_el instanceof FB2InlineMarkup) {
              // Обернуть содержимое выталкиваемого элемента копией родительского элемента
              const ie = new cur_el.constructor();
              if (!ie.name) ie.name = nm;
              ie.children = el.children;
              el.children = [ ie ];
            }
            accum.push(el);
            cur_el = new cur_el.constructor();
            if (!cur_el.name) cur_el.name = nm;
            accum.push(cur_el);
            done = false;
          } else {
            let cnt = 0;
            el.normalize().forEach(e => {
              // Убрать избыточную вложенность: <el><el>value</el></el> ==> <el>value</el>
              if (!e.value && e.children.length === 1 && e.name === e.children[0].name) {
                e = e.children[0];
              }
              if (e !== el) done = false;
              if (e.hasValue()) cur_el.children.push(e);
            });
          }
        });
        return accum;
      }, []);
      return { list: res_list, done: done };
    }
    //--
    let result = _normalize([ this ]);
    while (!result.done) {
      result = _normalize(result.list);
    }
    return result.list;
  }

  textContent() {
    let res = (!(this instanceof FB2BlockElement)) && this.value || '';
    return this.children.reduce((r, c) => {
      r += c.textContent();
      return r;
    }, res);
  }

  xml(doc) {
    const el = doc.createElement(this.name);
    if (this.value !== null) el.textContent = this.value;
    this.children.forEach(ch => el.appendChild(ch.xml(doc)));
    return el;
  }
}

class FB2BlockElement extends FB2Element {
  normalize() {
    // Предварительная нормализация
    this.children = this.children.reduce((list, ch) => {
      ch.normalize().forEach(cc => list.push(cc));
      return list;
    }, []);
    // Удалить пустоты справа
    while (this.children.length) {
      const el = this.children[this.children.length - 1];
      if (el instanceof FB2Text) el.trimRight();
      if (!el.hasValue()) {
        this.children.pop();
        continue;
      }
      break;
    }
    // Удалить пустоты слева
    while (this.children.length) {
      const el = this.children[0];
      if (el instanceof FB2Text) el.trimLeft();
      if (!el.hasValue()) {
        this.children.shift();
        continue;
      }
      break;
    }
    // Удалить пустоты в содержимом элемента
    if (!this.children.length && typeof(this.value) === "string") {
      this.value = this.value.trim();
    }
    // Окончательная нормализация
    return super.normalize();
  }
}

/**
 * Класс для идентификации текстовой разметки внутри блочных элементов
 */
class FB2InlineMarkup extends FB2Element {
}

/**
 * FB2 элемент верхнего уровня section
 */
class FB2Chapter extends FB2Element {
  constructor(title) {
    super("section");
    this.title = title;
  }

  normalize() {
    // Обернуть все запрещенные на этом уровне элементы в параграфы
    this.children = this.children.reduce((list, el) => {
      if (![ "p", "subtitle", "image", "empty-line", "cite", "list" ].includes(el.name)) {
        const pe = new FB2Paragraph();
        pe.children.push(el);
        el = pe;
      }
      el.normalize().forEach(el => {
        if (el.hasValue()) list.push(el);
      });
      return list;
    }, []);
    return [ this ];
  }

  xml(doc) {
    const el = super.xml(doc);
    if (this.title) {
      const t_el = doc.createElement("title");
      const p_el = doc.createElement("p");
      p_el.textContent = this.title;
      t_el.appendChild(p_el);
      el.prepend(t_el);
    }
    return el;
  }
}

/**
 * FB2 элемент верхнего уровня annotation
 */
class FB2Annotation extends FB2Element {
  constructor() {
    super("annotation");
  }

  normalize() {
    // Обернуть неформатированный текст, разделенный <br> в параграфы
    let lp = null;
    const newParagraph = list => {
      lp = new FB2Paragraph();
      list.push(lp);
    };
    this.children = this.children.reduce((list, el) => {
      if ([ "p", "subtitle", "cite" ].includes(el.name)) {
        list.push(el);
        lp = null;
      } else if (el.name === "empty-line") {
        if (!lp) {
          // Перенос между блоками
          if (list.length) list.push(new FB2EmptyLine);
        } else if (!lp.children.length) {
          // Более одного переноса подряд между inline элементами
          list.pop();
          list.push(new FB2EmptyLine());
          list.push(lp);
        } else {
          // Перенос между inline элементами
          newParagraph(list);
        }
      } else {
        if (!lp) newParagraph(list);
        lp.children.push(el);
      }
      return list;
    }, []);
    // Запустить собственную нормализацию дочерних элементов
    this.children = this.children.reduce((list, el) => {
      el.normalize().forEach(el => {
        if (el.hasValue()) list.push(el);
      });
      return list;
    }, []);
    // Удалить конечные пустые строки
    for (let len = this.children.length; len; ) {
      if (this.children[len - 1].name !== "empty-line") break;
      this.children.pop();
      --len;
    }
    return [ this ];
  }
}

class FB2Subtitle extends FB2BlockElement {
  constructor(value) {
    super("subtitle", value);
  }
}

class FB2Paragraph extends FB2BlockElement {
  constructor(value) {
    super("p", value);
  }
}

class FB2Cite extends FB2BlockElement {
  constructor() {
    super("cite");
  }

  normalize() {
    // Обернуть запрещенные внутри cite элементы в параграфы
    this.children = this.children.reduce((list, ch) => {
      if (![ "p", "subtitle", "empty-line", "table", "text-author" ].includes(ch.name)) {
        const pe = new FB2Paragraph();
        pe.children.push(ch);
        ch = pe;
      }
      ch.normalize().forEach(el => {
        if (el.hasValue()) list.push(el);
      });
      return list;
    }, []);
    return [ this ];
  }
}

class FB2EmptyLine extends FB2Element {
  constructor() {
    super("empty-line");
  }

  hasValue() {
    return true;
  }
}

class FB2Text extends FB2Element {
  constructor(value) {
    super("text", value);
  }

  trimLeft() {
    if (typeof(this.value) === "string") this.value = this.value.trimLeft() || null;
    if (!this.value) {
      while (this.children.length) {
        const first_child = this.children[0];
        if (first_child instanceof FB2Text) first_child.trimLeft();
        if (first_child.hasValue()) break;
        this.children.shift();
      }
    }
  }

  trimRight() {
    while (this.children.length) {
      const last_child = this.children[this.children.length - 1];
      if (last_child instanceof FB2Text) last_child.trimRight();
      if (last_child.hasValue()) break;
      this.children.pop();
    }
    if (!this.children.length && typeof(this.value) === "string") {
      this.value = this.value.trimRight() || null;
    }
  }

  xml(doc) {
    if (!this.value && this.children.length) {
      let fr = doc.createDocumentFragment();
      for (const ch of this.children) {
        fr.appendChild(ch.xml(doc));
      }
      return fr;
    }
    return doc.createTextNode(this.value);
  }
}

class FB2Link extends FB2Element {
  constructor(href) {
    super("a");
    this.href = href;
  }

  xml(doc) {
    const el = super.xml(doc);
    el.setAttribute("l:href", this.href);
    return el;
  }
}

class FB2List extends FB2Element {
  constructor() {
    super("list");
  }

  xml(doc) {
    const fr = doc.createDocumentFragment();
    for (const ch of this.children) {
      if (ch.hasValue()) {
        let ch_el = null;
        if (ch instanceof FB2BlockElement) {
          ch_el = ch.xml(doc);
        } else {
          const par = new FB2Paragraph();
          par.children.push(ch);
          ch_el = par.xml(doc);
        }
        if (ch_el.textContent.trim() !== "") fr.appendChild(ch_el);
      }
    }
    return fr;
  }
}

class FB2OrderedList extends FB2List {
  xml(doc) {
    let pos = 0;
    const fr = super.xml(doc);
    for (const el of fr.children) {
      ++pos;
      el.prepend(`${pos}. `);
    }
    return fr;
  }
}

class FB2UnorderedList extends FB2List {
  xml(doc) {
    const fr = super.xml(doc);
    for (const el of fr.children) {
      el.prepend("- ");
    }
    return fr;
  }
}

class FB2Author extends FB2Element {
  constructor(s) {
    super("author");
    const a = s.split(" ");
    switch (a.length) {
      case 1:
        this.nickName = s;
        break;
      case 2:
        this.firstName = a[0];
        this.lastName = a[1];
        break;
      default:
        this.firstName = a[0];
        this.middleName = a.slice(1, -1).join(" ");
        this.lastName = a[a.length - 1];
        break;
    }
    this.homePage = null;
  }

  hasValue() {
    return (!!this.firstName || !!this.lastName || !!this.middleName);
  }

  toString() {
    if (!this.firstName) return this.nickName;
    return [ this.firstName, this.middleName, this.lastName ].reduce((list, name) => {
      if (name) list.push(name);
      return list;
    }, []).join(" ");
  }

  xml(doc) {
    let a_el = super.xml(doc);
    [
      [ "first-name", this.firstName ], [ "middle-name", this.middleName ],
      [ "last-name", this.lastName ], [ "nickname", this.nickName ],
      [ "home-page", this.homePage ]
    ].forEach(it => {
      if (it[1]) {
        const e = doc.createElement(it[0]);
        e.textContent = it[1];
        a_el.appendChild(e);
      }
    });
    return a_el;
  }
}

class FB2Image extends FB2Element {
  constructor(value) {
    super("image");
    if (typeof(value) === "string") {
      this.url = value;
    } else {
      this.value = value;
    }
  }

  async load(onprogress) {
    if (this.url) {
      const bin = await this._load(this.url, { responseType: "binary", onprogress: onprogress });
      this.type = bin.type;
      this.size = bin.size;
      if (!this.suffix()) throw new Error("Неизвестный формат изображения");
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.addEventListener("loadend", (event) => resolve(event.target.result));
        reader.readAsDataURL(bin);
      }).then(base64str => {
        this.value = this._getBase64String(base64str);
      }).catch(err => {
        throw new Error("Ошибка загрузки изображения");
      });
    }
  }

  hasValue() {
    return true;
  }

  xml(doc) {
    if (this.value) {
      const el = doc.createElement(this.name);
      el.setAttribute("l:href", "#" + this.id);
      return el
    }
    const id = this.id || "изображение";
    return doc.createTextNode(`[ ${id} ]`);
  }

  xmlBinary(doc) {
    const el = doc.createElement("binary");
    el.setAttribute("id", this.id);
    el.setAttribute("content-type", this.type);
    el.textContent = this.value
    return el;
  }

  suffix() {
    switch (this.type) {
      case "image/png":
        return ".png";
      case "image/jpeg":
        return ".jpg";
      case "image/gif":
        return ".gif";
      case "image/webp":
        return ".webp";
    }
    return "";
  }

  async convert(targetType) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.addEventListener("load", () => {
        const cvs = document.createElement("canvas");
        cvs.width = img.width;
        cvs.height = img.height;
        cvs.getContext("2d", { alpha: false }).drawImage(img, 0, 0);
        this.value = this._getBase64String(cvs.toDataURL(targetType));
        this.type = targetType;
        resolve();
      });
      img.addEventListener("error", () => reject(new Error("Некорректный формат изображения")));
      img.src = `data:${this.type};base64,` + this.value;
    });
  }

  async _load(...args) {
    return FB2Loader.addJob(...args);
  }

  _getBase64String(data) {
    return data.substr(data.indexOf(",") + 1);
  }
}

class FB2Note extends FB2Element {
  constructor(value, title) {
    super("note");
    this.value = value;
    this.title = title;
  }

  xml(doc) {
    const el = doc.createElement("a");
    el.setAttribute("l:href", "#" + this.id);
    el.setAttribute("type", "note");
    el.textContent = `[${this.title}]`;
    return el;
  }

  xmlSection(doc) {
    const sec = new FB2Chapter(this.title);
    sec.children.push(new FB2Paragraph(this.value));
    const el = sec.xml(doc);
    el.setAttribute("id", this.id);
    return el;
  }
}

class FB2Table extends FB2BlockElement {
  constructor(rows) {
    super("table");
    if (Array.isArray(rows)) this.children = rows;
  }
}

class FB2TableRow extends FB2Element {
  constructor(cells) {
    super("tr");
    if (Array.isArray(cells)) this.children = cells;
  }
}

class FB2TableCell extends FB2Element {
  constructor(value) {
    super("td", value);
  }

  xml(doc) {
    const el = super.xml(doc);
    if (this.colSpan) el.setAttribute("colspan", this.colSpan);
    if (this.rowSpan) el.setAttribute("rowspan", this.rowSpan);
    return el;
  }
}

class FB2TableHeader extends FB2TableCell {
  constructor(value) {
    super(value);
    this.name = "th";
  }
}

class FB2Genre extends FB2Element {
  constructor(value) {
    super("genre", value);
  }
}

class FB2UnknownNode extends FB2Element {
  constructor(value) {
    super("unknown", value);
  }

  xml(doc) {
    return doc.createTextNode(this.value && this.value.textContent || "");
  }
}

class FB2GenreList extends Array {
  constructor(...args) {
    if (args.length === 1 && typeof(args[0]) === "number") {
      super(args[0]);
      return;
    }
    const list = (args.length === 1) ? (Array.isArray(args[0]) ? args[0] : [ args[0] ]) : args;
    super();
    if (!list.length) return;
    const keys = FB2GenreList._keys;
    const gmap = new Map();
    const addWeight = (name, weight) => gmap.set(name, (gmap.get(name) || 0) + weight);

    list.forEach(p_str => {
      p_str = p_str.toLowerCase();
      let words = p_str.split(/[\s,.;]+/);
      if (words.length === 1) words = [];
      for (const it of keys) {
        const exact_names = Array.isArray(it[1]) ? it[1] : [ it[1] ];
        if (it[0] === p_str || exact_names.includes(p_str)) {
          addWeight(it[0], 3); // Exact match
          break;
        }
        // Scan each word
        let weight = words.some(w => exact_names.includes(w)) ? 2 : 0;
        it[2] && it[2].forEach(k => {
          if (words.includes(k)) ++weight;
        });
        if (weight >= 2) addWeight(it[0], weight);
      }
    });

    const res = [];
    gmap.forEach((weight, name) => res.push([ name, weight]));
    if (!res.length) return;
    res.sort((a, b) => b[1] > a[1]);

    // Add at least five genres with maximum weight
    let cur_w = 0;
    for (const it of res) {
      if (it[1] !== cur_w && this.length >= 5) break;
      cur_w = it[1];
      this.push(new FB2Genre(it[0]));
    }
  }
}

FB2GenreList._keys = [
  [ "adv_animal", "природа и животные", [ "приключения", "животные", "природа" ] ],
  [ "adventure", "приключения" ],
  [ "adv_geo", "путешествия и география", [ "приключения", "география", "путешествие" ] ],
  [ "adv_history", "исторические приключения", [ "история", "приключения" ] ],
  [ "adv_indian", "вестерн, про индейцев", [ "индейцы", "вестерн" ] ],
  [ "adv_maritime", "морские приключения", [ "приключения", "море" ] ],
  [ "adv_modern", "приключения в современном мире", [ "современный", "мир" ] ],
  [ "adv_story", "авантюрный роман" ],
  [ "antique", "старинное" ],
  [ "antique_ant", "античная литература", [ "старинное", "античность" ] ],
  [ "antique_east", "древневосточная литература", [ "старинное", "восток" ] ],
  [ "antique_european", "европейская старинная литература", [ "старинное", "европа" ] ],
  [ "antique_myths", "мифы. легенды. эпос", [ "мифы", "легенды", "эпос", "фольклор" ] ],
  [ "antique_russian", "древнерусская литература", [ "древнерусское", "старинное" ] ],
  [ "aphorism_quote", "афоризмы, цитаты", [ "афоризмы", "цитаты", "проза" ] ],
  [ "architecture_book", "скульптура и архитектура", [ "дизайн" ] ],
  [ "art_criticism", "искусствоведение" ],
  [ "art_world_culture", "мировая художественная культура", [ "искусство", "искусствоведение" ] ],
  [ "astrology", "астрология и хиромантия", [ "астрология", "хиромантия" ] ],
  [ "auto_business", "автодело" ],
  [ "auto_regulations", "автомобили и ПДД", [ "дорожного", "движения", "дорожное", "движение" ] ],
  [ "banking", "финансы", [ "банки", "деньги" ] ],
  [ "child_adv", "приключения для детей и подростков" ],
  [ "child_classical", "классическая детская литература" ],
  [ "child_det", "детская остросюжетная литература" ],
  [ "child_education", "детская образовательная литература" ],
  [ "child_folklore", "детский фольклор" ],
  [ "child_prose", "проза для детей" ],
  [ "children", "детская литература", [ "детское" ] ],
  [ "child_sf", "фантастика для детей" ],
  [ "child_tale", "сказки народов мира" ],
  [ "child_tale_rus", "русские сказки" ],
  [ "child_verse", "стихи для детей" ],
  [ "cine", "кино" ],
  [ "comedy", "комедия" ],
  [ "comics", "комиксы" ],
  [ "comp_db", "программирование, программы, базы данных", [ "программирование", "базы", "программы" ] ],
  [ "comp_hard", "компьютерное железо", [ "аппаратное" ] ],
  [ "comp_soft", "программное обеспечение" ],
  [ "computers", "компьютеры" ],
  [ "comp_www", "ос и сети, интернет", [ "ос", "сети", "интернет" ] ],
  [ "design", "дизайн" ],
  [ "det_action", [ "боевики", "боевик" ], [ "триллер" ] ],
  [ "det_classic", "классический детектив" ],
  [ "det_crime", "криминальный детектив", [ "криминал" ] ],
  [ "det_espionage", "шпионский детектив", [ "шпион", "шпионы", "детектив" ] ],
  [ "det_hard", "крутой детектив" ],
  [ "det_history", "исторический детектив", [ "история" ] ],
  [ "det_irony", "иронический детектив" ],
  [ "det_maniac", "про маньяков", [ "маньяки", "детектив" ] ],
  [ "det_police", "полицейский детектив", [ "полиция", "детектив" ] ],
  [ "det_political", "политический детектив", [ "политика", "детектив" ] ],
  [ "det_su", "советский детектив", [ "ссср", "детектив" ] ],
  [ "detective", "детектив", [ "детективы" ] ],
  [ "drama", "драма" ],
  [ "drama_antique", "античная драма" ],
  [ "dramaturgy", "драматургия" ],
  [ "economics", "экономика" ],
  [ "economics_ref", "деловая литература" ],
  [ "epic", "былины, эпопея", [ "былины", "эпопея" ] ],
  [ "epistolary_fiction", "эпистолярная проза" ],
  [ "equ_history", "история техники" ],
  [ "fairy_fantasy", "мифологическое фэнтези", [ "мифология", "фантастика" ] ],
  [ "family", "семейные отношения", [ "дом", "семья" ] ],
  [ "fanfiction", "фанфик" ],
  [ "folklore", "фольклор, загадки" ],
  [ "folk_songs", "народные песни" ],
  [ "folk_tale", "народные сказки" ],
  [ "foreign_antique", "средневековая классическая проза" ],
  [ "foreign_children", "зарубежная литература для детей" ],
  [ "foreign_prose", "зарубежная классическая проза" ],
  [ "geo_guides", "путеводители, карты, атласы", [ "география", "атласы", "карты", "путеводители" ] ],
  [ "gothic_novel", "готический роман" ],
  [ "great_story", "роман", [ "повесть" ] ],
  [ "home", "домоводство", [ "дом", "семья" ] ],
  [ "home_collecting", "коллекционирование" ],
  [ "home_cooking", "кулинария", [ "домашняя", "еда" ] ],
  [ "home_crafts", "хобби и ремесла" ],
  [ "home_diy", "сделай сам" ],
  [ "home_entertain", "развлечения" ],
  [ "home_garden", "сад и огород" ],
  [ "home_health", "здоровье" ],
  [ "home_pets", "домашние животные" ],
  [ "home_sex", "семейные отношения, секс" ],
  [ "home_sport", "боевые исскусства, спорт" ],
  [ "hronoopera", "хроноопера" ],
  [ "humor", "юмор" ],
  [ "humor_anecdote", "анекдоты" ],
  [ "humor_prose", "юмористическая проза" ],
  [ "humor_satire", "сатира" ],
  [ "humor_verse", "юмористические стихи, басни", [ "юмор", "стихи", "басни" ] ],
  [ "limerick", [ "частушки", "прибаутки", "потешки" ] ],
  [ "literature_18", "классическая проза XVII-XVIII веков" ],
  [ "literature_19", "классическая проза ХIX века" ],
  [ "literature_20", "классическая проза ХX века" ],
  [ "love", "любовные романы" ],
  [ "love_contemporary", "современные любовные романы" ],
  [ "love_detective", "остросюжетные любовные романы", [ "детектив", "любовь" ] ],
  [ "love_erotica", "эротика", [ "эротическая", "литература" ] ],
  [ "love_hard", "порно" ],
  [ "love_history", "исторические любовные романы", [ "история", "любовь" ] ],
  [ "love_sf", "любовное фэнтези" ],
  [ "love_short", "короткие любовные романы" ],
  [ "lyrics", "лирика" ],
  [ "military_history", "военная история", [ "война", "история" ] ],
  [ "military_special", "военное дело" ],
  [ "military_weapon", "военная техника и вооружение", [ "военная", "вооружение", "техника" ] ],
  [ "modern_tale", "современная сказка" ],
  [ "music", "музыка" ],
  [ "network_literature", "сетевая литература" ],
  [ "nonf_biography", "биографии и мемуары", [ "биография", "биографии", "мемуары" ] ],
  [ "nonf_criticism", "критика" ],
  [ "nonfiction", "документальная литература" ],
  [ "nonf_military", "военная документалистика и аналитика" ],
  [ "nonf_publicism", "публицистика" ],
  [ "notes:", "партитуры" ],
  [ "org_behavior", "маркентиг, pr", [ "организации" ] ],
  [ "painting", "живопись", [ "альбомы", "иллюстрированные", "каталоги" ] ],
  [ "palindromes", "визуальная и экспериментальная поэзия", [ "верлибры", "палиндромы", "поэзия" ] ],
  [ "periodic", "журналы, газеты", [ "журналы", "газеты" ]],
  [ "poem", "поэма", [ "эпическая", "поэзия" ] ],
  [ "poetry", "поэзия" ],
  [ "poetry_classical", "классическая поэзия" ],
  [ "poetry_east", "поэзия востока" ],
  [ "poetry_for_classical", "классическая зарубежная поэзия" ],
  [ "poetry_for_modern", "современная зарубежная поэзия" ],
  [ "poetry_modern", "современная поэзия" ],
  [ "poetry_rus_classical", "классическая русская поэзия" ],
  [ "poetry_rus_modern", "современная русская поэзия", [ "русская", "поэзия" ] ],
  [ "popadanec", "попаданцы", [ "попаданец" ] ],
  [ "popular_business", "карьера, кадры", [ "карьера", "дело", "бизнес" ] ],
  [ "prose", "проза" ],
  [ "prose_abs", "фантасмагория, абсурдистская проза" ],
  [ "prose_classic", "классическая проза" ],
  [ "prose_contemporary", "современная русская и зарубежная проза", [ "современная", "проза" ] ],
  [ "prose_counter", "контркультура" ],
  [ "prose_game", "игры, упражнения для детей", [ "игры", "упражнения" ] ],
  [ "prose_history", "историческая проза", [ "история", "проза" ] ],
  [ "prose_magic", "магический реализм", [ "магия", "проза" ] ],
  [ "prose_military", "проза о войне" ],
  [ "prose_neformatny", "неформатная проза", [ "экспериментальная", "проза" ] ],
  [ "prose_rus_classic", "русская классическая проза" ],
  [ "prose_su_classics", "советская классическая проза" ],
  [ "proverbs", "пословицы", [ "поговорки" ] ],
  [ "ref_dict", "словари", [ "справочник" ] ],
  [ "ref_encyc", "энциклопедии", [ "энциклопедия" ] ],
  [ "ref_guide", "руководства", [ "руководство", "справочник" ] ],
  [ "ref_ref", "справочники", [ "справочник" ] ],
  [ "reference", "справочная литература" ],
  [ "religion", "религия", [ "духовность", "эзотерика" ] ],
  [ "religion_budda", "буддизм" ],
  [ "religion_catholicism", "католицизм" ],
  [ "religion_christianity", "христианство" ],
  [ "religion_esoterics", "эзотерическая литература", [ "эзотерика" ] ],
  [ "religion_hinduism", "индуизм" ],
  [ "religion_islam", "ислам" ],
  [ "religion_judaism", "иудаизм" ],
  [ "religion_orthdoxy", "православие" ],
  [ "religion_paganism", "язычество" ],
  [ "religion_protestantism", "протестантизм" ],
  [ "religion_self", "самосовершенствование" ],
  [ "russian_fantasy", "славянское фэнтези", [ "русское", "фэнтези" ] ],
  [ "sci_biology", "биология", [ "биофизика", "биохимия" ] ],
  [ "sci_botany", "ботаника" ],
  [ "sci_build", "строительство и сопромат", [ "строительтво", "сопромат" ] ],
  [ "sci_chem", "химия" ],
  [ "sci_cosmos", "астрономия и космос", [ "астрономия", "космос" ] ],
  [ "sci_culture", "культурология" ],
  [ "sci_ecology", "экология" ],
  [ "sci_economy", "экономика" ],
  [ "science", "научная литература" ],
  [ "sci_geo", "геология и география" ],
  [ "sci_history", "история" ],
  [ "sci_juris", "юриспруденция" ],
  [ "sci_linguistic", "языкознание", [ "иностранный", "язык" ] ],
  [ "sci_math", "математика" ],
  [ "sci_medicine_alternative", "альтернативная медицина" ],
  [ "sci_medicine", "медицина" ],
  [ "sci_metal", "металлургия" ],
  [ "sci_oriental", "востоковедение" ],
  [ "sci_pedagogy", "педагогика, воспитание детей, литература для родителей", [ "воспитание", "детей" ] ],
  [ "sci_philology", "литературоведение" ],
  [ "sci_philosophy", "философия" ],
  [ "sci_phys", "физика" ],
  [ "sci_politics", "политика" ],
  [ "sci_popular", "зарубежная образовательная литература", [ "зарубежная", "научно-популярная" ] ],
  [ "sci_psychology", "психология и психотерапия" ],
  [ "sci_radio", "радиоэлектроника" ],
  [ "sci_religion", "религиоведение", [ "религия", "духовность" ] ],
  [ "sci_social_studies", "обществознание", [ "социология" ] ],
  [ "sci_state", "государство и право" ],
  [ "sci_tech", "технические науки", [ "техника", "наука" ] ],
  [ "sci_textbook", "учебники и пособия" ],
  [ "sci_theories", "альтернативные науки и научные теории" ],
  [ "sci_transport", "транспорт и авиация" ],
  [ "sci_veterinary", "ветеринария" ],
  [ "sci_zoo", "зоология" ],
  [ "science", "научная литература", [ "образование" ] ],
  [ "screenplays", "сценарии", [ "сценарий" ] ],
  [ "sf", "научная фантастика", [ "наука", "фантастика" ] ],
  [ "sf_action", "боевая фантастика" ],
  [ "sf_cyberpunk", "киберпанк" ],
  [ "sf_detective", "детективная фантастика", [ "детектив", "фантастика" ] ],
  [ "sf_epic", "эпическая фантастика", [ "эпическое", "фэнтези" ] ],
  [ "sf_etc", "фантастика" ],
  [ "sf_fantasy", "фэнтези" ],
  [ "sf_fantasy_city", "городское фэнтези" ],
  [ "sf_heroic", "героическая фантастика", [ "героическое", "герой", "фэнтези" ] ],
  [ "sf_history", "альтернативная история", [ "историческое", "фэнтези" ] ],
  [ "sf_horror", "ужасы", [ "фантастика" ] ],
  [ "sf_humor", "юмористическая фантастика", [ "юмор", "фантастика" ] ],
  [ "sf_litrpg", "литрпг", [ "litrpg", "рпг" ] ],
  [ "sf_mystic", "мистика", [ "мистическая", "фантастика" ] ],
  [ "sf_postapocalyptic", "постапокалипсис" ],
  [ "sf_realrpg", "реалрпг", [ "realrpg" ] ],
  [ "sf_social", "Социально-психологическая фантастика", [ "социум", "психология", "фантастика" ] ],
  [ "sf_space", "космическая фантастика", [ "космос", "фантастика" ] ],
  [ "sf_stimpank", "стимпанк" ],
  [ "sf_technofantasy", "технофэнтези" ],
  [ "song_poetry", "песенная поэзия" ],
  [ "story", "рассказ", [ "рассказы", "эссе", "новеллы", "новелла", "феерия", "сборник", "рассказов" ] ],
  [ "tale_chivalry", "рыцарский роман", [ "рыцари", "приключения" ] ],
  [ "tbg_computers", "учебные пособия, самоучители", [ "пособия", "самоучители" ] ],
  [ "tbg_higher", "учебники и пособия ВУЗов", [ "учебники", "пособия" ] ],
  [ "tbg_school", "школьные учебники и пособия, рефераты, шпаргалки", [ "школьные", "учебники", "шпаргалки", "рефераты" ] ],
  [ "tbg_secondary", "учебники и пособия для среднего и специального образования", [ "учебники", "пособия", "образование" ] ],
  [ "theatre", "театр" ],
  [ "thriller", "триллер", [ "триллеры", "детектив", "детективы" ] ],
  [ "tragedy", "трагедия", [ "драматургия" ] ],
  [ "travel_notes", " география, путевые заметки", [ "география", "заметки" ] ],
  [ "vaudeville", "мистерия", [ "буффонада", "водевиль" ] ],
];

class FB2Loader {
  static async addJob(url, params) {
    params ||= {};
    const fp = {};
    fp.method = params.method || "GET";
    fp.credentials = "same-origin";
    fp.signal = this._getSignal();
    if (params.headers) fp.headers = params.headers;
    const resp = await fetch(url, fp);
    if (!resp.ok) throw new Error(`Сервер вернул ошибку (${resp.status})`);
    const reader = resp.body.getReader();
    const type = resp.headers.get("Content-Type");
    const total = +resp.headers.get("Content-Length");
    let loaded = 0;
    const chunks = [];
    const onprogress = (total && typeof(params.onprogress) === "function") ? params.onprogress : null;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;
      if (onprogress) onprogress(loaded, total);
    }
    let result = null;
    switch (params.responseType) {
      case "binary":
        result = new Blob(chunks, { type: type });
        break;
      default:
        {
          let pos = 0;
          const data = new Uint8Array(loaded);
          for (let ch of chunks) {
            data.set(ch, pos);
            pos += ch.length;
          }
          result = (new TextDecoder("utf-8")).decode(data);
        }
        break;
    }
    return params.extended ? { headers: resp.headers, response: result } : result;
  }

  static abortAll() {
    if (this._controller) {
      this._controller.abort();
      this._controller = null;
    }
  }

  static _getSignal() {
    let controller = this._controller;
    if (!controller) this._controller = controller = new AbortController();
    return controller.signal;
  }
}

class FB2Utils {
  static dateToAtom(date) {
    const m = date.getMonth() + 1;
    const d = date.getDate();
    return "" + date.getFullYear() + '-' + (m < 10 ? "0" : "") + m + "-" + (d < 10 ? "0" : "") + d;
  }
}
