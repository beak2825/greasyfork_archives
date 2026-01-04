// ==UserScript==
// @name         gb7715-2015 bibtex
// @namespace    https://github.com/guleonseon/GB7714BibTex
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.min.js
// @version      1.4
// @description  CNKI -> BibTex
// @author       Guleon
// @match        https://kns.cnki.net/kns/ViewPage/viewsave.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/400077/gb7715-2015%20bibtex.user.js
// @updateURL https://update.greasyfork.org/scripts/400077/gb7715-2015%20bibtex.meta.js
// ==/UserScript==

(function() {
    'use strict';

    class base {
        constructor(base) {
            this.base = base
        }

        getData() {
            return this.base
        }
    }

    class article extends base {
        constructor(base, extend) {
            super(base)
            this.journal = extend.journal
            this.volume = extend.volume
            this.number = extend.number
            this.pages = extend.pages
        }
        toString() {
            var base = super.getData()
            return (
                '@article{cite_id,' +
                '\n' +
                '    title=' +
                '{' +
                base.title +
                '},\n' +
                '    author=' +
                '{' +
                base.author +
                '},\n' +
                '    journal=' +
                '{' +
                this.journal +
                '},\n' +
                '    year=' +
                '{' +
                base.year +
                '},\n' +
                '    volume=' +
                '{' +
                this.volume +
                '},\n' +
                '    number=' +
                '{' +
                this.number +
                '},\n' +
                '    pages=' +
                '{' +
                this.pages +
                '}\n' +
                '}\n'
            )
        }
    }

    class thesis extends base {
        constructor(base, extend) {
            super(base)
            this.school = extend.school
        }
        toString() {
            var base = super.getData()
            return (
                '@thesis{cite_id,' +
                '\n' +
                '    title=' +
                '{' +
                base.title +
                '},\n' +
                '    author=' +
                '{' +
                base.author +
                '},\n' +
                '    school=' +
                '{' +
                this.school +
                '},\n' +
                '    year=' +
                '{' +
                base.year +
                '}\n' +
                '}\n'
            )
        }
    }

    class conference extends base {
        constructor(base, extend) {
            super(base)
            this.publisher = extend.publisher
            this.booktitle = extend.booktitle
            this.address = extend.address
            this.pages = extend.pages
        }
        toString() {
            var base = super.getData()
            return (
                '@inproceedings{cite_id,' +
                '\n' +
                '    title=' +
                '{' +
                base.title +
                '},\n' +
                '    author=' +
                '{' +
                base.author +
                '},\n' +
                '    booktitle=' +
                '{' +
                this.booktitle +
                '},\n' +
                '    address=' +
                '{' +
                this.address +
                '},\n' +
                '    publisher=' +
                '{' +
                this.publisher +
                '},\n' +
                '    year=' +
                '{' +
                base.year +
                '},\n' +
                '    pages=' +
                '{' +
                this.pages +
                '}\n' +
                '}\n'
            )
        }
    }

    var map = {
        C: 'conference',
        J: 'article',
        D: 'thesis',
    }

    function debug(str) {
        return console.log(str)
    }

    var btn = "<input type=\"button\" value=\"BibTex\" class=\"save clipboard\" id=\"bib_save\">";
    jQuery(document).ready(function($) {
        $(".btnDiv").append(btn)

        $("#bib_save").click(function(){

            var bibTex = ''
            var str = document.getElementsByClassName('CurContentID')[0].innerText

            // 扫描文章类型，只支持 C、J、D 三种类型
            var scan = /.*\[([A-Z])\].*/
            var types = scan.exec(str)

            if (types == null || map[types[1]] == null) {
                alert('不支持的引用类型')
                return
            }

            var baseInfo = {
                author: '',
                title: '',
                year: '',
            }

            switch (map[types[1]]) {
                case 'article':
                    processArticle()
                    break
                case 'thesis':
                    processThesis()
                    break
                case 'conference':
                    processConference()
                    break
                default:
                    alert('error in article type')
            }

            function processArticle() {
                var reg = /^\[[0-9]*\](.*)\.(.*)\.(.*)\./
                var items = reg.exec(str)
                debug(items)

                var authors = items[1].split(',')
                var author = authors.join(' and ')
                debug(authors)
                debug(author)
                baseInfo.author = author

                var title = /(.*)\[.*\]/.exec(items[2])[1].trim()
                debug(title)
                baseInfo.title = title

                var miscs = /(.*),(.*),(.*)\((.*)\):(.*)/.exec(items[3])
                debug(miscs)
                baseInfo.year = miscs[2]
                var extend = {
                    journal: miscs[1].trim(),
                    volume: miscs[3].trim(),
                    number: miscs[4].trim(),
                    pages: miscs[5].trim(),
                }
                bibTex = new article(baseInfo, extend).toString()
                debug(bibTex)
            }

            function processThesis() {
                var reg = /^\[[0-9]*\](.*)\.(.*)\.(.*)\./
                var items = reg.exec(str)
                debug(items)

                var authors = items[1].split(',')
                var author = authors.join(' and ')
                debug(authors)
                debug(author)
                baseInfo.author = author

                var title = /(.*)\[.*\]/.exec(items[2])[1].trim()
                debug(title)
                baseInfo.title = title

                var miscs = /(.*),(.*)/.exec(items[3])
                debug(miscs)
                baseInfo.year = miscs[2].trim()
                var extend = {
                    school: miscs[1].trim(),
                }
                bibTex = new thesis(baseInfo, extend).toString()
                debug(bibTex)
            }

            function processConference() {
                var reg = /^\[[0-9]*\](.*)\.(.*)\.(.*)\.(.*)\.(.*)\./
                var items = reg.exec(str)
                debug(items)

                var authors = items[1].split(',')
                var author = authors.join(' and ')
                debug(authors)
                debug(author)
                baseInfo.author = author

                var title = /(.*)\[.*\]/.exec(items[2])[1].trim()
                debug(title)
                baseInfo.title = title

                var booktitle = items[4].trim()

                var miscs = /(.*):(.*),(.*):(.*)/.exec(items[5])
                debug(miscs)
                baseInfo.year = miscs[3].trim()
                var extend = {
                    address: miscs[1].trim(),
                    booktitle: booktitle,
                    publisher: miscs[2].trim(),
                    pages: miscs[4].trim(),
                }
                bibTex = new conference(baseInfo, extend).toString()
                debug(bibTex)
            }

            const input = document.createElement('textarea')
            input.value = bibTex
            document.body.appendChild(input)
            input.select()
            document.execCommand('Copy')
            document.body.removeChild(input)
            alert("成功复制到剪切板\n"+bibTex)
        })
    })

})();
