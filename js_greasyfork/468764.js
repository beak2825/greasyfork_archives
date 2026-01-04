// ==UserScript==
// @name         WaniKani Markdown Editor Notes (2023)
// @namespace    wanikani
// @description  Write Markdown and HTML in the notes
// @version      2.2.0
// @require      https://uicdn.toast.com/editor/latest/toastui-editor-all.min.js
// @require      https://unpkg.com/dexie@3/dist/dexie.js
// @require      https://greasyfork.org/scripts/430565-wanikani-item-info-injector/code/WaniKani%20Item%20Info%20Injector.user.js?version=1276693
// @icon         https://www.google.com/s2/favicons?sz=64&domain=markdownguide.org
// @match        *://www.wanikani.com/*
// @match        *://preview.wanikani.com/*
// @license      MIT
// @homepage     https://greasyfork.org/en/scripts/468764-wanikani-markdown-editor-notes-2023
// @source       https://github.com/patarapolw/wanikani-userscript/blob/master/userscripts/markdown-notes.user.js
// @supportURL   https://community.wanikani.com/t/userscript-markdown-editor-notes-2023/62246
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468764/WaniKani%20Markdown%20Editor%20Notes%20%282023%29.user.js
// @updateURL https://update.greasyfork.org/scripts/468764/WaniKani%20Markdown%20Editor%20Notes%20%282023%29.meta.js
// ==/UserScript==

// @ts-check
/// <reference path="./types/item-info.d.ts" />
(function () {
  'use strict';

  const entryClazz = 'wk-markdown-notes';

  // @ts-ignore
  const _Dexie = /** @type {typeof import('dexie').default} */ (Dexie);
  /**
   * @typedef {{ id: number; state: any; markdown: string }} EntryMarkdown
   */

  class Database extends _Dexie {
    /** @type {import('dexie').Table<EntryMarkdown, number>} */
    markdown;

    constructor() {
      super(entryClazz);
      this.version(8)
        .stores({
          markdown: 'id,state.characters',
        })
        .upgrade((tx) => {
          const toKeep = [];
          tx.table('markdown')
            .each((it) => {
              if (it.markdown.trim()) {
                toKeep.push(it.id);
              }
            })
            .then(() => {
              return tx.table('markdown').where('id').noneOf(toKeep).delete();
            });
        });
    }
  }

  const wkMarkdown = {};
  Object.assign(window, { wkMarkdown });

  const db = new Database();
  wkMarkdown.db = db;

  /** @type {HTMLElement} */
  let elEditor;
  /** @type {import('@toast-ui/editor').Editor} */
  let editor;
  /** @type {WKItemInfoState} */
  let state;
  /** @type {EntryMarkdown | undefined} */
  let currentEntry;

  const injector = wkItemInfo
    .under('meaning,reading')
    .spoiling('nothing')
    .append('Markdown Notes', (o) => {
      save();
      state = o;

      const onElLoaded = () => {
        db.markdown.get(state.id).then((entry) => {
          currentEntry = entry;
          const md = entry?.markdown;
          setTimeout(() => {
            if (!editor) return;

            editor.changePreviewStyle('vertical');
            if (md) {
              editor.exec('toggle-preview');
            }

            setTimeout(() => {
              editor.blur();
            });
          });

          if (editor) {
            editor.setMarkdown(md || '');
          } else {
            /** @type {import('@toast-ui/editor').EditorOptions} */
            const opts = {
              el: elEditor,
              initialEditType: 'markdown',
              previewStyle: 'vertical',
              hideModeSwitch: true,
              linkAttributes: {
                target: '_blank',
              },
              toolbarItems: [
                ['heading', 'bold', 'italic', 'strike'],
                [
                  {
                    name: 'big',
                    tooltip: 'Big',
                    command: 'big',
                    text: 'BIG',
                    className: 'toastui-editor-toolbar-icons',
                    style: {
                      backgroundImage: 'none',
                      fontSize: '0.7em',
                      fontFamily: 'sans-serif',
                    },
                  },
                  {
                    name: 'furigana',
                    tooltip: 'Furigana',
                    command: 'furigana',
                    text: 'ふ',
                    className: 'toastui-editor-toolbar-icons',
                    style: {
                      backgroundImage: 'none',
                      fontSize: '1em',
                      fontFamily: 'sans-serif',
                    },
                  },
                  {
                    name: 'subject-type',
                    tooltip: 'Subject type',
                    text: '漢',
                    className: 'toastui-editor-toolbar-icons',
                    style: {
                      backgroundImage: 'none',
                      fontSize: '1em',
                      fontFamily: 'sans-serif',
                    },
                    popup: {
                      className: 'toastui-editor-popup-add-heading',
                      body: ((el) => {
                        el.className = 'toastui-editor-popup-body';

                        const ul = document.createElement('ul');
                        ul.setAttribute('aria-role', 'menu');
                        el.append(ul);

                        for (const p of ['rad', 'kan', 'voc', 'read']) {
                          const li = document.createElement('li');
                          ul.append(li);
                          li.setAttribute('aria-role', 'menuitem');

                          switch (p) {
                            case 'rad':
                              li.innerText = 'Radical';
                              break;
                            case 'kan':
                              li.innerText = 'Kanji';
                              break;
                            case 'voc':
                              li.innerText = 'Vocabulary';
                              break;
                            default:
                              li.innerText = 'Reading';
                          }
                          li.title = li.innerText;

                          li.onclick = () => {
                            const text = editor.getSelectedText();
                            if (text) {
                              editor.replaceSelection(`#${p}#${text}#/${p}#`);
                            }
                          };
                        }

                        return el;
                      })(document.createElement('div')),
                    },
                  },
                ],
                ['hr', 'quote'],
                ['ul', 'ol'],
                ['table', 'image', 'link'],
                // ['code', 'codeblock'],
                ['scrollSync'],
                [
                  {
                    name: 'preview',
                    tooltip: 'Preview',
                    el: ((btn) => {
                      btn.type = 'button';
                      btn.className =
                        'fa fa-eye toastui-editor-toolbar-icons toggle-preview';
                      btn.style.backgroundImage = 'none';
                      btn.style.fontSize = '1em';
                      btn.style.margin = '-7px -5px';
                      btn.onclick = () => {
                        editor.exec('toggle-preview');
                      };
                      return btn;
                    })(document.createElement('button')),
                  },
                  {
                    name: 'save',
                    tooltip: 'Save/Reload',
                    command: 'save',
                    text: '',
                    className: 'fa fa-save toastui-editor-toolbar-icons',
                    style: { backgroundImage: 'none', fontSize: '1em' },
                  },
                ],
              ],
              previewHighlight: false,
              customHTMLSanitizer: (s) => {
                return s;
              },
              customHTMLRenderer: {
                htmlInline: {
                  big(node, { entering }) {
                    const { attrs = {} } = node;
                    attrs.style = 'font-size: 2em';
                    return entering
                      ? {
                          type: 'openTag',
                          tagName: 'span',
                          attributes: attrs,
                        }
                      : { type: 'closeTag', tagName: 'span' };
                  },
                  small(node, { entering }) {
                    const { attrs = {} } = node;
                    attrs.style = 'font-size: 0.7em';
                    return entering
                      ? {
                          type: 'openTag',
                          tagName: 'span',
                          attributes: attrs,
                        }
                      : { type: 'closeTag', tagName: 'span' };
                  },
                },
                text: function (node, ctx) {
                  /** @type {import('@toast-ui/editor/types/toastmark').HTMLToken[]} */
                  const out = [];

                  /**
                   *
                   * @param {string} tag
                   * @param {() => void} doInside
                   */
                  const addTag = (tag, doInside) => {
                    out.push({
                      type: 'openTag',
                      tagName: tag,
                    });

                    doInside();

                    out.push({
                      type: 'closeTag',
                      tagName: tag,
                    });
                  };

                  /**
                   *
                   * @param {string} rb
                   * @param {string} rt
                   */
                  const addRubyContent = (rb, rt) => {
                    addTag('ruby', () => {
                      out.push({
                        type: 'text',
                        content: rb,
                      });

                      addTag('rp', () => {
                        out.push({
                          type: 'text',
                          content: '(',
                        });
                      });

                      addTag('rt', () => {
                        out.push({
                          type: 'text',
                          content: rt,
                        });
                      });

                      addTag('rp', () => {
                        out.push({
                          type: 'text',
                          content: ')',
                        });
                      });
                    });
                  };

                  /**  @param {string} s */
                  const wkFuriganaParser = (s) => {
                    const segments = s.split(/<(.+?)>\[(.+?)\]/g);
                    while (segments.length) {
                      const [raw, rb, rt] = segments.splice(0, 3);
                      out.push({
                        type: 'text',
                        content: raw,
                      });

                      if (rb) {
                        addRubyContent(rb, rt);
                      }
                    }
                  };

                  /**  @param {string} s */
                  const mdItFuriganaParser = (s) => {
                    const segments = s.split(/\[(.+?)\]\{(.+?)\}/g);
                    while (segments.length) {
                      const [raw, rb, rt] = segments.splice(0, 3);
                      wkFuriganaParser(raw);

                      if (rb) {
                        addTag('ruby', () => {
                          let rbArr = rb.split('.');
                          if (rbArr.length === 1) {
                            rbArr = rb.split('');
                          }
                          const rtArr = rt.split('.');

                          if (rbArr.length >= rtArr.length) {
                            rtArr.map((t, i) => {
                              if (i < rtArr.length - 1) {
                                addRubyContent(rbArr[i], t);
                              } else {
                                addRubyContent(rbArr.slice(i).join(''), t);
                              }
                            });
                          } else {
                            addRubyContent(rb, rt);
                          }
                        });
                      }
                    }
                  };

                  /** @param {string} s */
                  const wkMarkParser = (s) => {
                    const segments = s.split(
                      /#(rad|kan|voc|read)#(.+?)#\/\1#/g,
                    );
                    while (segments.length) {
                      const [raw, p, text] = segments.splice(0, 3);
                      mdItFuriganaParser(raw);

                      if (text) {
                        let className = '';
                        let title = '';

                        switch (p) {
                          case 'rad':
                            className = 'radical-highlight';
                            title = 'Radical';
                            break;
                          case 'kan':
                            className = 'kanji-highlight';
                            title = 'Kanji';
                            break;
                          case 'voc':
                            className = 'vocabulary-highlight';
                            title = 'Vocabulary';
                            break;
                          default:
                            className = 'reading-highlight';
                            title = 'Reading';
                        }

                        out.push(
                          {
                            type: 'openTag',
                            tagName: 'span',
                            classNames: [className],
                            attributes: { title },
                          },
                          {
                            type: 'text',
                            content: text,
                          },
                          {
                            type: 'closeTag',
                            tagName: 'span',
                          },
                        );
                      }
                    }
                  };

                  wkMarkParser(node.literal || '');

                  return out;
                },
              },
              autofocus: false,
              initialValue: md,
            };

            // @ts-ignore
            editor = new toastui.Editor(opts);
            wkMarkdown.editor = editor;

            editor.addCommand('markdown', 'save', () => {
              save();
              const md = editor.getMarkdown();
              // editor.reset();
              editor.setMarkdown(md, false);
              return true;
            });

            editor.addCommand('markdown', 'toggle-preview', () => {
              if (editor.getCurrentPreviewStyle() === 'tab') {
                editor.changePreviewStyle('vertical');
              } else {
                editor.changePreviewStyle('tab');
                const elPreviewButton = elEditor.querySelector(
                  '.toastui-editor-tabs > .tab-item:last-child',
                );

                if (elPreviewButton instanceof HTMLElement) {
                  elPreviewButton.click();
                }
              }
              return false;
            });

            editor.addCommand('markdown', 'big', () => {
              const text = editor.getSelectedText();
              if (text) {
                editor.replaceSelection(`<big>${text}</big>`);
                return true;
              }
              return false;
            });

            editor.addCommand('markdown', 'furigana', () => {
              const text = editor.getSelectedText();
              if (text) {
                editor.replaceSelection(`[${text}]{ふり}`);
                return true;
              }
              return false;
            });

            editor.on('blur', () => {
              save();
            });
          }
        });
      };

      if (!elEditor) {
        elEditor = document.createElement('div');
        elEditor.id = 'wk-markdown-editor';
        elEditor.lang = 'ja';
        elEditor.onkeydown = (ev) => {
          ev.stopImmediatePropagation();
          ev.stopPropagation();
        };
      }

      onElLoaded();

      return elEditor;
    });

  window.addEventListener('willShowNextQuestion', () => {
    injector.renew();
  });

  function save(force = true) {
    if (editor) {
      const markdown = editor.getMarkdown().trim();
      if (markdown || currentEntry) force = true;

      if (force) {
        db.markdown.put({ id: state.id, state, markdown }, state.id);
      }

      if (!elEditor) {
        editor.destroy();
      }
    }
  }

  const isClickedClass = 'is-clicked';

  (function add_css() {
    const style = document.createElement('style');

    const K = '.toastui-editor-defaultUI';

    style.append(
      document.createTextNode(/* css */ `
    @import url("https://uicdn.toast.com/editor/latest/toastui-editor.min.css");

    ${K} {
      /* Font list from Jisho.org */
      --md-font-family-sans-serif: "Source Han Sans", "源ノ角ゴシック", "Hiragino Sans", "HiraKakuProN-W3", "Hiragino Kaku Gothic ProN W3", "Hiragino Kaku Gothic ProN", "ヒラギノ角ゴ ProN W3", "Noto Sans", "Noto Sans CJK JP", "メイリオ", Meiryo, "游ゴシック", YuGothic, "ＭＳ Ｐゴシック", "MS PGothic", "ＭＳ ゴシック", "MS Gothic", sans-serif;
      --md-font-family-serif: "HiraMinProN-W3", "Hiragino Mincho ProN W3", "Hiragino Mincho ProN", "ヒラギノ明朝 ProN W3", "游明朝", YuMincho, "HG明朝E", "ＭＳ Ｐ明朝", "MS PMincho", "MS 明朝", "MS Mincho", serif;
      --md-font-family: var(--md-font-family-sans-serif);

      background-color: #fff;
    }

    ${K} .ProseMirror {
      font-family: var(--md-font-family);
    }

    ${K} .toastui-editor-md-preview * {
      font-family: var(--md-font-family);
    }

    ${K} .serif {
      font-family: var(--md-font-family-serif);
    }

    ${K} .sans,
    ${K} .sans-serif {
      font-family: var(--md-font-family-sans-serif);
    }

    ${K} .toastui-editor-md-tab-container {
      display: none !important;
    }

    ${K} .toastui-editor-toolbar-icons.${isClickedClass} {
      background-color: gray;
    }
    `),
    );

    document.head.append(style);
  })();
})();
