// ==UserScript==
// @name        Get Outline of Teachable Course
// @namespace   https://eriknewhard.com/
// @author      everruler12
// @description Adds a button to Teachable's header navbar, which opens a panel letting you easily copy a course's outline to your note-taking app.
// @version     1.3.1
// @license     ISC
// @icon        https://teachable.com/favicon.ico
// @grant       none
// @match       *://*/courses/enrolled/*
// @match       *://*/courses/*/lectures/*
// @require     https://cdnjs.cloudflare.com/ajax/libs/vue/2.6.11/vue.js
// @downloadURL https://update.greasyfork.org/scripts/404224/Get%20Outline%20of%20Teachable%20Course.user.js
// @updateURL https://update.greasyfork.org/scripts/404224/Get%20Outline%20of%20Teachable%20Course.meta.js
// ==/UserScript==

// Check whether Teachable course if page contains:
// <meta name="asset_host" content="https://fedora.teachablecdn.com">
if ($('meta[name="asset_host"]') &&
    $('meta[name="asset_host"]').attr('content') == 'https://fedora.teachablecdn.com') {
    init()
}


function init() {

    let button = $(`
<a id="EV_userscript-button" class="nav-icon-settings" style="float: left;" aria-label="Copy Teachable Course Structure" @click="togglePanel">
    <i class="fa fa-copy" title="Copy Teachable Course Structure"></i>
</a>
`)

    let panel = $(`
<div id="EV_userscript-panel" v-show="isVisible">
    <div style="text-align: left;">
        <input type="checkbox" style="width: 3em;" v-model="settings_doublespace"> Double-space<br>
        <input type="checkbox" style="width: 3em;" v-model="settings_timelength"> Include video time length<br>
        <input type="checkbox" style="width: 3em;" v-model="settings_links"> Include markdown links<br>
        <input type="text" style="width: 3em;" v-model="markdown_section"> Section markdown<br>
        <input type="text" style="width: 3em;" v-model="markdown_lecture"> Lecture markdown<br>
        (insert '\\t' for tab indents)
    </div>
    <br>
    <div>
        <textarea id="EV_userscript-textarea" style="width: 100%;" rows="10" v-model="text"></textarea>
        <input class="btn btn-primary btn-md" type="submit" :value="copy_button" @click="copy">
    </div>
</div>
`)

    $('.lecture-left').children().first().after(button)
    $('.course-sidebar .course-progress').prepend(panel)

    var vm_panel = new Vue({
        el: '#EV_userscript-panel',
        data: {
            course_name: '',
            outline: '',
            markdown_section: '### ',
            markdown_lecture: '- ',
            settings_doublespace: true,
            settings_timelength: true,
            settings_links: true,
            isVisible: false,
            copy_button: 'Copy'
        },
        computed: {
            text() {
                if (!this.outline) return ''

                return '# ' + this.course_name + this.linebreak + this.outline.map(section => {
                    return this.markdown.section + section.section_name + this.linebreak + section.lecture_names.map(lecture => {
                        let lecture_name = lecture.name
                        if (this.settings_timelength && lecture.timelength)
                            lecture_name += ' ' + lecture.timelength

                        if (this.settings_links)
                            return `${this.markdown.lecture}[${lecture_name}](${lecture.link})`
                        else
                            return `${this.markdown.lecture}${lecture_name}`

                    }).join(this.linebreak)
                }).join(this.linebreak)
            },
            markdown() {
                return {
                    section: this.parseMarkdown(this.markdown_section),
                    lecture: this.parseMarkdown(this.markdown_lecture)
                }
            },
            linebreak() {
                return this.settings_doublespace ? '\n\n' : '\n'
            }
        },
        methods: {
            parseMarkdown(md) {
                md = md.replace(/\\t/g, '\t')
                return md ? md : ''
            },
            copy() {
                $('#EV_userscript-textarea').select()
                document.execCommand("copy")
                this.copy_button = 'Copied!'
                setTimeout(() => this.copy_button = 'Copy', 1000)

            },
            fetch() {
                this.course_name = $('.course-sidebar > h2').text()

                this.outline = $('.course-section').map((i, row) => {
                    var section_els = $(row).find('.section-title')
                    var section_name = nonChildTextNode(section_els)

                    var lectures_els = $(row).find('.section-item')

                    var lecture_names = lectures_els.map((i, el) => {
                        const lecture_name_text = $(el).find('.lecture-name')[0]

                        const lecture_name = nonChildTextNode(lecture_name_text)
                            .split('\n')
                            .map(x => x.trim())
                            .filter(x => !!x)

                        return {
                            name: lecture_name[0],
                            timelength: lecture_name[1],
                            link: window.location.origin + $(el).find('.item').attr('href')
                        }
                    }).toArray()

                    return {
                        section_name,
                        lecture_names
                    }
                }).toArray()
            }
        }
    })

    var vm_button = new Vue({
        el: '#EV_userscript-button',
        methods: {
            togglePanel() {
                if (!vm_panel.isVisible) {
                    vm_panel.fetch()
                }

                vm_panel.isVisible = !vm_panel.isVisible
            }
        }
    })
}



function nonChildTextNode(el) {
    return $(el).contents().filter(function () {
        return this.nodeType == 3 // 3 is Node.TEXT_NODE
    }).text().trim()
}
