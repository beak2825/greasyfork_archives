// ==UserScript==
// @name        雷利子
// @namespace   https://github.com/oneNorth7/Cloud189_popper
// @version     0.3.8
// @author      一个北七
// @description 突破新版天翼云盘单文件、多文件分享页、个人主页的文件大小下载限制；选中多个文件逐一直接下载，高速高效无需客户端
// @icon        https://gitee.com/oneNorth7/pics/raw/master/picgo/pentagram-devil.png
// @created     2021/3/13 下午6:23:05
// @match       *://cloud.189.cn/web/share?code=*
// @match       *://cloud.189.cn/web/main/file/folder/*
// @match       *://cloud.189.cn/web/main/recentlyUploaded*
// @compatible  chrome 69+
// @compatible  firefox 78+
// @compatible  edge Latest
// @noframes
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require     https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @run-at      document-end
// @grant       unsafeWindow
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/424022/%E9%9B%B7%E5%88%A9%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/424022/%E9%9B%B7%E5%88%A9%E5%AD%90.meta.js
// ==/UserScript==

void function() {
    'use strict';
    const sizeLimit = 1024 * 1<<10 * 1<<10;
    const buttonText = '\u76f4\u63a5\u4e0b\u8f7d';
    const buttonStyle = {'background-color': '#36BE63', 'color': 'white'};
    
    let t = {
        clog() {
                console.group('[\u96f7\u5229\u5b50]');
                for (let m of arguments) {
                    if (void 0 !== m) console.dir(m);
                }
                console.groupEnd();
        },
        
        set(name, value) {
            GM_setValue(name, value);
        },
        
        get(name, def) {
            return GM_getValue(name, def);
        },
        
        registerMenu(title, func) {
            return GM_registerMenuCommand(title, func);
        },
        
        copy(text, type='text/plain') {
            GM_setClipboard(text, type);
        },
        
        increase() {
            success_times = +this.get("success_times", 0) + 1;
            this.set("success_times", success_times);
        },

        subscribe() {
            let isFollowed = this.get('isFollowed', false),
                least_times = this.get('least_times', 20),
                success_times = +this.get("success_times");
            if (success_times > least_times && !isFollowed) {
                Swal.fire({
                          title: '\u5173\u6ce8\u516c\u4f17\u53f7\uff0c\u4e0d\u8ff7\u8def\uff01',
                          html: $(
                        `<div><img style="width: 300px;margin: 5px auto;" src="https://gitee.com/oneNorth7/pics/raw/master/picgo/oneNorth7.png"><p style="font-size: 16px;color: red;">\u7b2c\u4e00\u65f6\u95f4\u83b7\u53d6\u66f4\u65b0\u63a8\u9001\uff01\uff01\uff01</p></div>`
                    )[0],
                          showCancelButton: true,
                          allowOutsideClick: false,
                          confirmButtonColor: '#d33',
                          confirmButtonText: '\u5df2\u5173\u6ce8\uff0c\u4e0d\u518d\u63d0\u9192\uff01',
                          cancelButtonColor: '#3085d6',
                          cancelButtonText: '\u7a0d\u540e\u5173\u6ce8',
                        }).then((result) => {
                          if (result.isConfirmed) {
                            Swal.fire({
                              position: 'center',
                              icon: 'success',
                              title: '\u611f\u8c22\u5173\u6ce8\uff01\uff01\uff01',
                              text: '\u4e00\u4e2a\u5317\u4e03\u4f1a\u7ee7\u7eed\u4e0d\u9057\u4f59\u529b\u5730\u521b\u4f5c\u66f4\u591a\u5b9e\u7528\u5de5\u5177',
                              showConfirmButton: false,
                              timer: 2000
                            });
                            this.set('isFollowed', true);
                          } else this.set('least_times', least_times + 15);
                        });
            } else flag = true;
        },
        
        info(text, icon='success', title = '\u96f7\u5229\u5b50', position='top', timer=2000) {
            if (flag) {
                if (icon == 'error') timer = timer == 2000 ? 3000 : timer;
                return Swal.fire({
                          position,
                          icon,
                          toast: true,
                          title,
                          text,
                          showConfirmButton: false,
                          timer
                        });
            }
        },
    };
    
    let success_times = t.get("success_times"), flag = false;
    if (!success_times || isNaN(success_times)) t.set("success_times", 0);
    t.subscribe();
    
    const o = location.origin,
              h = location.host,
              hr = location.href,
              ha = location.hash,
              s = location.search;
    const api = ['/api/open/user/getUserInfoForPortal.action',
                 '/api/open/share/getShareInfoByCode.action',
                 '/api/open/file/getFileDownloadUrl.action',
                 '/api/portal/listFiles.action'];
    
    let main = {
        hideTip() {
            $('div.tips-save-box').hide();
        },
        
        isLogin() {
            return $('div.person-info').children().length != 2;
        },
        
        getFileInfo() {
            let code = s.replace('?code=', '');
            if (code) {
                this._get(api[1], {shareCode: code},
                    res => {
                        this.shareId = res.shareId;
                    
                        if (res.isFolder) {
                            this.multiShare();
                            this.dealLis(res.shareId);
							
                        } else if(res.fileSize > sizeLimit){
							$('div.outlink-box-s:hidden').show();
                            this.singleShare(res.fileId, res.shareId);
                            
                        } else {
							$('div.outlink-box-s:hidden').show();
                            $('a[class="btn btn-download"]').removeAttr('target').text(buttonText).css(buttonStyle);
						}
                    },
                    err => {
                        t.clog('error:', err);
                    });
            } else {
                this.mainPage();
                this.dealLis();
                
                let recent = () => {
                    $('div.uploadList').delegate('div.uploadPath>a', 'click', o => {
                        setTimeout(() => {
                            this.mainPage();
                            this.dealLis();
                            $('span[class^="FileListHead_file-list-nav-"]')
                             .on('click', o => {
                                 setTimeout(() => this.dealLis(), 1000);
                             });
                        }, 1000);
                    });
                };
                
                $('li.title-link.title-recentupload').on('click', o => {
                   setTimeout(() => recent(), 1000);
                });
                
                if (location.pathname.match('\\/web\\/main\\/recentlyUploaded.*')) {
                    setTimeout(() => recent(), 1000);
                }
            }
            
            $('li.title-message,\
			div.nav-logo,\
			li.title-link.title-return,\
			li.menu-item:contains(" \u4e91\u76d8 "),\
            div[class^="FileListHead_typeListItem_"],\
            span[class^="FileListHead_file-list-nav-"],\
            div[class^="FileListHead_file-list-head_"]>div:last')
            .on('click', o => {
				setTimeout(() => this.dealLis(this.shareId), 1000);
			});
        },
        
        directDownload(time = 500, delay = 500) {
            let items = $('li.c-file-item.selected:not([data-isfolder])');
            if (items.length > 10) {
                Swal.fire({
                          title: `\u5df2\u9009\u4e2d${items.length}\u4e2a\u6587\u4ef6\uff0c\u6570\u91cf\u8d85\u8fc710`,
                          html: '<p style="color: red">\u662f\u5426\u5168\u90e8\u9010\u4e00\u4e0b\u8f7d\uff1f</p>',
                          icon: 'warning',
                          showCancelButton: true,
                          allowOutsideClick: false,
                          confirmButtonColor: '#d33',
                          confirmButtonText: '\u786e\u5b9a\u5168\u90e8\u4e0b\u8f7d',
                          cancelButtonColor: '#3085d6',
                          cancelButtonText: '\u53d6\u6d88\u4e0b\u8f7d',
                        }).then(result => {
                            if (result.isConfirmed) {
                                items.each((i, e) => setTimeout(() => this.download(i, e, items.length), time += delay));
                                t.info('\u5168\u90e8\u6587\u4ef6\u5f00\u59cb\u9010\u4e00\u4e0b\u8f7d');
                            }
                        });
            } else if (items.length > 0) {
                items.each((i, e) => setTimeout(() => this.download(i, e, items.length), time += delay));
            } else if ($('li.c-file-item.selected[data-isfolder]').length)
                t.info('\u9009\u4e2d\u4e3a\u6587\u4ef6\u5939\uff0c\u8bf7\u8fdb\u5165\u76ee\u5f55\u4e0b\u8f7d\uff01', 'info');
        },
        
        download(i, e, l) {
            this.replaceDownload($(e).find('input'), this.shareId);
            
            if (l === i + 1) {
                if ($('li.c-file-item.selected[data-isfolder]').length)
                    setTimeout(() => {
                        t.info('\u9009\u4e2d\u7684\u6587\u4ef6\u5939\u5df2\u8df3\u8fc7\uff0c\u8bf7\u8fdb\u5165\u76ee\u5f55\u4e0b\u8f7d\uff01', 'info');
                    }, 1000);
            }
        },
        
        _get(url, data, success, error = () => {}) {
            data.noCache = Math.random();
            return $.ajax(url,
                          {data,
                           success,
                           error,
                           headers: {Accept: 'application/json;charset=UTF-8'}
                          });
        },
        
        singleShare(fileId, shareId) {
            this._get(api[2], {fileId, shareId, dt: 1},
                      res => {
                        let saveBox = $('div.save-box'),
                            attrs = saveBox[0].attributes,
                            link = null;

                        for (let i = 0; i < attrs.length; i++) {
                            if (attrs[i].nodeName.startsWith('data-v-')) {
                                link = $(`<a ${attrs[i].nodeName}="" class="btn btn-download">直接下载</a>`).css(buttonStyle);
                                break;
                            }
                        }
                        saveBox.after(link.prop('href', res.fileDownloadUrl));
                        t.increase();
                        setTimeout(() => t.info('\u6210\u529f\u7a81\u7834\u6587\u4ef6\u5927\u5c0f\u4e0b\u8f7d\u9650\u5236\uff01'), 100);
                     },
                     err => {
                        t.clog('error', err);
                        setTimeout(() => t.info('\u83b7\u53d6\u4e0b\u8f7d\u76f4\u94fe\u5931\u8d25\uff01', 'error'), 1000);
                     });
        },
        
        replaceDownload(e, shareId) {
            let fileId = $(e).parents('li').attr('data-fileid');
            let href = $(e).data('href'),
                result = href ? href.match(/&expired=(\d+)&/) : 0,
                time = new Date(Number(result && result[1]));
            if (time < new Date) {
                let data = {fileId};
                if (shareId) Object.assign(data, {shareId, dt: 1});
                this._get(api[2], data,
                          res => {
                            let url = res.fileDownloadUrl
                            $(e).data('href', url)
                            let iframe = $(`<iframe src="${url}" style="display: none;"></iframe>`);
                            $(document.head).append(iframe);
                            if (Number($(e).parents('div.file-item-name').next().text().replace('G', '')) > 1) {
                                t.increase();
                            }
                          },
                          err => {
                            $(e).parents('.file-item-ope').prev().css('color', '#f0424f');
                            t.clog('error', err);
                            t.info('\u83b7\u53d6\u4e0b\u8f7d\u76f4\u94fe\u5931\u8d25\uff01', 'error');
                          });
            } else {
                let url = $(e).data('href'),
                    iframe = $(`<iframe src="${url}" style="display: none;"></iframe>`);
                $(document.head).append(iframe);
            }
        },
        
        multiShare() {
            $('section.c-file-list').delegate('li, label.ant-checkbox-wrapper', 'mousedown', o => {
                setTimeout(() => {
                    let button = $('div.button-normal:contains("\u4e0b\u8f7d")');
                    if (!$(`div.button-normal:contains("${buttonText}")`).length) {
                        let another = button.clone().text(buttonText).css(buttonStyle).removeClass('disable').click(() => this.directDownload());
                        button.replaceWith(another);
                    }
                }, 500);
            });
        },

        dealLis(shareId) {
            let dealLi = e => {
                    if ($(e).attr('data-isfolder')) {
                        $(e).find('span.file-item-name-fileName-span').one('click',
                        o => {
                            setTimeout(() => {
                                this.dealLis(shareId);

                                $('span[class^="FileListHead_file-list-nav-"]')
                                .on('click', o => {
                                    setTimeout(() => this.dealLis(shareId), 1000);
                                });
                            }, 1000);
                        });
                    } else {
                        let span = $(e).find('span.file-item-ope-item-download');
                        if (span.length)
                            span.replaceWith(span.clone().prop('title', buttonText).on('click', o => this.replaceDownload(o.target, shareId)));
                        else {
                            let span = $(e).find('span.file-item-ope-item-save'),
                                another = span.clone()
                                              .prop({'title': buttonText, 'class': "file-item-ope-item-icon file-item-ope-item-download"})
                                              .on('click', o => this.replaceDownload(o.target, shareId));
                                span.parent().next().html(another);
                        }  
                    }
                };
            
            $('ul.file-list-ul>li').each((i, e) => dealLi(e));
            
            $('ul.file-list-ul').on('DOMNodeInserted', o => {
                if (o.target.localName === 'li') dealLi(o.target);
            });
        },
        
        mainPage() {
            this.alwaysList();

            $('section.c-file-list').delegate('li, label.ant-checkbox-wrapper', 'mousedown', o => {
                setTimeout(() => {
                    let button = $('div.button-normal:contains("\u4e0b\u8f7d")');
                    if (!$(`div.button-normal:contains("${buttonText}")`).length) {
                        let another = button.clone().text(buttonText).css(buttonStyle).click(() => this.directDownload());
                        button.replaceWith(another);
                    }

                    let menu = $('div[class^="menu_menu-block-item_"]:contains("\u4e0b\u8f7d")');
                    if (!$(`div[class^="menu_menu-block-item_"]:contains("${buttonText}")`).length) {
                        let another = menu.clone().text(buttonText).click(() => this.directDownload());
                        menu.replaceWith(another);
                    }
                }, 500);
            });
            
            $('div[class^="DirectoryTree_directory-li_"]')
            .delegate('span.directory-name', 'click', o => {
                setTimeout(() => {
                    this.dealLis();
                    $('span[class^="FileListHead_file-list-nav-"]')
                    .on('click', o => {
                        setTimeout(() => this.dealLis(), 1000);
                    });
                }, 1000);
            });
        },
        
        alwaysList() {
            let display = $('div[class^="FileListHead_file-list-head_"]>div:last');
            if (display.children('div').length) {
                display.find('div[title="\u70b9\u51fb\u5207\u6362\u5230\u56fe\u6807\u6a21\u5f0f"]:contains("\u5217\u8868"):visible').click();
            } else if (display.text().trim() === '\u56fe\u6807') {
                display.click();
            }
        },
        
        init() {
			if (!$('div.error-content:visible').length) {
				if (!$('#code_txt:visible').length) {
					setTimeout(async () => {
						if (!this.isLogin()) {
							Swal.fire('\u8bf7\u5148\u767b\u5f55\uff01', '\u5fc5\u987b\u767b\u5f55\u624d\u80fd\u7a81\u7834\u4e0b\u8f7d\u9650\u5236', 'info');
							$('body').removeClass('swal2-height-auto');
						} else {
							this.hideTip();
							this.getFileInfo();
							if (flag) t.info('\u5c01\u5370\u89e3\u9664\uff01');
						}
					}, 1000);

				} else {
					t.info('\u81ea\u52a8\u586b\u5199\u7f51\u76d8\u5bc6\u7801', 'info', '\u63a8\u8350\u4f7f\u7528<\u94fe\u63a5\u52a9\u624b>');
					
					$('a.btn-primary').click(() => {
						setTimeout(() => {
							if ($('div.file-operate:visible').length) {
								if (this.isLogin()) location.reload();
								else {
									Swal.fire('\u8bf7\u5148\u767b\u5f55\uff01', '\u5fc5\u987b\u767b\u5f55\u624d\u80fd\u7a81\u7834\u4e0b\u8f7d\u9650\u5236', 'info');
									$('body').removeClass('swal2-height-auto');
								}
							}
						}, 500);
					});
					
					$('#code_txt').one('focus', () => {
						let tip = $('div.tips-save-box').clone(true, true).css({top: '230px', left: '50px'})
						tip.children('p').css({width: '110px', top: '35px', left: '8px'}).html('\u8bd5\u8bd5\u80fd\u81ea\u52a8\u586b\u5199\u7f51\u76d8\u5bc6\u7801\u7684\ud83d\udc49<a target="_blank" href="https://greasyfork.org/zh-CN/scripts/422773-%E9%93%BE%E6%8E%A5%E5%8A%A9%E6%89%8B" style="color:#2b89ea;position:relative;display:inline;top:0;left:0;text-decoration:underline;">\u94fe\u63a5\u52a9\u624b</a>');
						tip.children('img').prop('alt', '\u94fe\u63a5\u52a9\u624b');
						tip.children('a').click(o => $(o.target).parent().hide());
						$('div.access-code-item').append(tip);
					});
				}
			}
        },
    };
    
    $('body').one('DOMNodeInserted', 'i.anticon-close-circle', o => $('div.outlink-box-s').length && $(o.target).parent('div:contains("暂不支持该格式在线预览或播放")').hide());
    setTimeout(() => main.init(), 1500);
    
}();