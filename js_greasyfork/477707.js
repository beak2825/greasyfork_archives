// ==UserScript==
// @name        躲啥躲
// @description b站PC端视频/番剧等评论归属显形，点击可调整文字颜色
// @author      (σ｀д′)σ
// @version     1.2.2
// @namespace   https://greasyfork.org/zh-CN/scripts/477707
// @license     GPL-3.0-or-later
// @match       *://www.bilibili.com/video/*
// @match       *://www.bilibili.com/bangumi/play/*
// @grant       GM_addStyle
// @run-at      document-end
// @supportURL  https://greasyfork.org/zh-CN/scripts/477707
// @homepageURL https://github.com/Xli33/odd-monkey
// @downloadURL https://update.greasyfork.org/scripts/477707/%E8%BA%B2%E5%95%A5%E8%BA%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/477707/%E8%BA%B2%E5%95%A5%E8%BA%B2.meta.js
// ==/UserScript==

(() => {
  'use strict';

  const getEl = (name) => document.querySelector(name);

  // comment area
  const elComment = getEl('#commentapp') || getEl('#comment-module');
  if (!elComment) return;

  if (location.pathname.startsWith('/video/')) {
    // observe once
    const observeOnce = (parent, sel, callback, options) => {
      new MutationObserver((mutations, ob) => {
        const el = parent.querySelector(sel);
        if (el) {
          ob.disconnect();
          callback(el);
        }
      }).observe(parent, {
        childList: true,
        // subtree: true,
        ...options
      });
    };

    // watch on need
    observeOnce(elComment, 'bili-comments', (el) => {
      // info to show
      const id = '--' + Math.floor(Math.random() * 10000),
        labelClass = 'com-ip' + id,
        colorClass = labelClass + '-input';
      const getExtraEle = (text) => {
        if (!text) return '';
        const ele = document.createElement('label');
        ele.part = labelClass;
        ele.innerHTML = `${text}<input type="color" part=${colorClass} />`;
        ele.title = '点击调色';
        for (const k in colorEvent) {
          ele.firstElementChild[k] = colorEvent[k];
        }
        return ele;
      };
      const colorEvent = {
        oninput(e) {
          elComment.style.setProperty(id, e.target.value);
        },
        onchange(e) {
          localStorage._ipsv = e.target.value;
        },
        onclick(e) {
          e.target.value = elComment.style.getPropertyValue(id);
        }
      };

      elComment.style.setProperty(id, localStorage._ipsv || '#9499a0');
      GM_addStyle(
        `bili-comments::part(${labelClass}){color:var(${id})}bili-comments::part(${colorClass}){overflow:hidden;width:0;height:0;border:none;padding:0;visibility:hidden;}`
      );

      // by hook
      if (customElements.get('bili-comment-renderer')) {
        const update = (proto, isFooter, key = 'updated') => {
          const refUpdated = proto[key];
          const baseFunc = function (e) {
            refUpdated.call(this, e);
            this.setAttribute('exportparts', labelClass + ',' + colorClass);
          };
          proto[key] = !isFooter
            ? baseFunc
            : function (e) {
                baseFunc.call(this, e);
                if (isFooter) {
                  this.renderRoot.querySelector(`:host>label[part=${labelClass}]`)
                    ? this.renderRoot.firstElementChild.replaceWith(
                        getExtraEle(this.data.reply_control.location)
                      )
                    : this.renderRoot.prepend(getExtraEle(this.data.reply_control.location));
                }
              };
        };
        const map = {
          'bili-comment-action-buttons-renderer': true,
          'bili-comment-thread-renderer': null,
          'bili-comment-renderer': null,
          'bili-comment-replies-renderer': null,
          'bili-comment-reply-renderer': null
        };
        for (const k in map) {
          update(customElements.get(k).prototype, map[k]);
        }
        return;
      }
      // by watcher
      observeOnce(el.shadowRoot, '#feed', (el) => {
        // handle list
        const handleList = (arr) => {
          arr.forEach((e) => {
            e.setAttribute('exportparts', labelClass + ',' + colorClass);
            observeOnce(e.shadowRoot, '#commentapp', (el) => {
              el.setAttribute('exportparts', labelClass + ',' + colorClass);
              observeOnce(el.shadowRoot, '#footer', (fel) => {
                fel.firstElementChild.setAttribute('exportparts', labelClass + ',' + colorClass);
                fel.firstElementChild.shadowRoot.prepend(
                  getExtraEle(fel.firstElementChild.data.reply_control.location)
                );

                // more to handle
                el.nextElementSibling.firstElementChild.setAttribute(
                  'exportparts',
                  labelClass + ',' + colorClass
                );
                const handleList = (arr) => {
                  arr.forEach((e) => {
                    e.setAttribute('exportparts', labelClass + ',' + colorClass);
                    observeOnce(e.shadowRoot, '#footer', (el) => {
                      el.firstElementChild.setAttribute(
                        'exportparts',
                        labelClass + ',' + colorClass
                      );
                      new MutationObserver(() => {
                        el.firstElementChild.shadowRoot.querySelector(`>label[part=${labelClass}]`)
                          ? el.firstElementChild.shadowRoot.firstElementChild.replaceWith(
                              getExtraEle(el.firstElementChild.data.reply_control.location)
                            )
                          : el.firstElementChild.shadowRoot.prepend(
                              getExtraEle(el.firstElementChild.data.reply_control.location)
                            );
                      }).observe(el.previousElementSibling.children[1].shadowRoot, {
                        childList: true,
                        subtree: true
                      });
                    });
                  });
                };

                new MutationObserver((mutations) => {
                  handleList(
                    mutations
                      .filter((e) => e.addedNodes[0]?.nodeName === 'BILI-COMMENT-REPLY-RENDERER')
                      .flatMap((e) => e.addedNodes[0])
                  );
                }).observe(
                  el.nextElementSibling.firstElementChild.shadowRoot.querySelector(
                    '#expander-contents'
                  ),
                  {
                    childList: true
                  }
                );
                handleList(
                  Array.from(
                    el.nextElementSibling.firstElementChild.shadowRoot.querySelectorAll(
                      '#expander-contents>bili-comment-reply-renderer'
                    )
                  )
                );
              });
            });
          });
        };

        new MutationObserver((mutations) => {
          handleList(
            mutations
              .filter((e) => e.addedNodes[0]?.nodeName === 'BILI-COMMENT-THREAD-RENDERER')
              .flatMap((e) => e.addedNodes[0])
          );
        }).observe(el, {
          childList: true
        });
        handleList(Array.from(el.children));
      });
    });

    return;
  }

  // if comments exist
  new MutationObserver((mutations, ob) => {
    const elReplyList = elComment.querySelector('.reply-list');
    if (elReplyList) {
      ob.disconnect();
      watchReply(elReplyList);
    }
  }).observe(elComment, {
    childList: true,
    subtree: true
  });

  const watchReply = (elReplyList) => {
    // 防重复执行mutation
    let flag;
    const { apiData } =
        elComment.firstElementChild.__vue_app__.config.globalProperties.$store.state,
      id = '--' + Math.floor(Math.random() * 10000),
      labelClass = 'com-ip' + id;

    // 要展示的信息
    const getExtraEle = (text) => {
      if (!text) return '';
      const ele = document.createElement('label');
      ele.className = labelClass;
      ele.innerHTML = `${text}<input type="color"/>`;
      ele.title = '点击调色';
      return ele;
    };

    // 处理子级评论
    // 子评论下有新的子评论，也可能是原评论位置变动
    const handleSubReply = (el) => {
      // console.log("%c子评论", "font-size:16px;color:cyan");
      // const { reply_control } = el.__vueParentComponent.ctx.subReply;
      const { rootReplyId, userId } = el.querySelector('.sub-reply-avatar').dataset;
      const { reply_control } = findReply(
        rootReplyId,
        false,
        userId,
        Array.from(el.parentNode.children).indexOf(el)
      );
      el.querySelector('.sub-reply-info').prepend(getExtraEle(reply_control.location));
    };

    // get by rrid...
    const findReply = (rrid, isRoot, subUid, subIndex) => {
      const rootReply = apiData.replyList.res.data.replies.find((e) => e.rpid_str === rrid);
      return (
        (isRoot
          ? rootReply
          : rootReply?.replies
              .filter((e) => !e.invisible)
              .find((e, i) => e.mid_str === subUid && i === subIndex)) ?? {
          reply_control: {}
        }
      );
    };

    // 观察评论区节点并给新评论增加ip等额外信息展示
    new MutationObserver((mutations) => {
      if (flag) {
        flag = null;
        return;
      }
      mutations
        .filter((e) => e.addedNodes.length > 0)
        .forEach((e) => {
          if (e.type !== 'childList' || e.addedNodes[0].nodeType !== 1) return;
          // 根评论下有新的子评论
          if (e.target === elReplyList && e.addedNodes[0].classList.contains('reply-item')) {
            // const { reply_control } =
            // 	e.addedNodes[0].__vueParentComponent.ctx.reply;
            const { reply_control } = findReply(
              e.addedNodes[0].querySelector('.root-reply-avatar').dataset.rootReplyId,
              true
            );
            e.addedNodes[0]
              .querySelector('.reply-info')
              .prepend(getExtraEle(reply_control.location));
            // 处理根评论下的子评论
            e.addedNodes[0].querySelectorAll('.sub-reply-item').forEach((se) => {
              handleSubReply(se);
            });
            flag = true;

            return;
          }
          if (
            e.target.classList.contains('sub-reply-list') &&
            e.addedNodes[0].classList.contains('sub-reply-item') &&
            !e.addedNodes[0].querySelector('.sub-reply-info > .' + labelClass)
          ) {
            handleSubReply(e.addedNodes[0]);
            flag = true;
          }
        });
    }).observe(elReplyList, {
      attributes: false,
      childList: true,
      subtree: true
    });

    // 通过列表代理color input相关事件
    elReplyList.oninput = (e) => {
      if (e.target.parentNode.className === labelClass) {
        elReplyList.style.setProperty(id, e.target.value);
      }
    };
    elReplyList.onchange = (e) => {
      if (e.target.parentNode.className === labelClass) {
        // elReplyList.style.setProperty(id, e.target.value);
        localStorage._ipsv = e.target.value;
      }
    };
    elReplyList.onclick = (e) => {
      if (e.target.nodeName === 'INPUT' && e.target.parentNode.className === labelClass) {
        e.target.value = elReplyList.style.getPropertyValue(id);
      }
    };

    // 添加css
    elReplyList.style.setProperty(id, localStorage._ipsv || '#9499A0');
    GM_addStyle(
      `.${labelClass}{margin-right:10px;color:var(${id})}.${labelClass}>input{overflow:hidden;width:0;height:0;border:none;visibility:hidden;}`
    );
  };
})();
