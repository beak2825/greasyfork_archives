// ==UserScript==
// @name        dcrmrf
// @namespace   dcrmrf
// @description 디시인사이드 갤로그 클리너
// @version     0.1.11
// @author      Sangha Lee
// @copyright   2025, Sangha Lee
// @license     MIT
// @match       https://gallog.dcinside.com/*/posting*
// @match       https://gallog.dcinside.com/*/comment*
// @icon        https://nstatic.dcinside.com/dc/m/img/dcinside_icon.png
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_deleteValue
// @grant       GM_deleteValues
// @grant       GM_listValues
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/530031/dcrmrf.user.js
// @updateURL https://update.greasyfork.org/scripts/530031/dcrmrf.meta.js
// ==/UserScript==

/**
 * @typedef {'G'|'M'|'MI'|'PR'} GalleryType
 */

/**
 * @typedef {'mi$'|'pr$'} GalleryPrefix
 */

/**
 * @typedef {Object} Log
 * @property {Gallery} gallery
 * @property {number} id
 * @property {?string} title
 */

/**
 * @typedef {'posting'|'comment'} LogType
 */

/**
 * @typedef {Object} Logs
 * @property {LogType} type 로그 종류
 * @property {number} page 페이지 번호
 * @property {number} totalCount 전체 로그 수
 * @property {?number} totalCategoryCount 카테고리 내 전체 로그 수
 * @property {number[]} categories 이 로그 종류에 존재하는 모든 카테고리 번호들
 * @property {Log[]} items
 */


class InvalidCaptchaError extends Error {}


class Utils {
    /**
     * 비동기로 웹 요청을 실행합니다
     * @param {Object} options
     * @returns {Promise<Object>}
     */
    static fetch (options) {
        return new Promise((resolve, reject) => {
            if (!('method' in options)) {
                options.method = 'GET'
            }
    
            options.onabort = () => reject('사용자가 작업을 취소했습니다')
            options.ontimeout = () => reject('작업 시간이 초과됐습니다')
            options.onerror = reject
            options.onload = resolve
            GM_xmlhttpRequest(options)
        })
    }

    /**
     * alert 과 console.error 메소드에 오류를 출력합니다
     * @param {Error} err 
     * @param {string|Array<string>} message 
     */
    static printError (err, message) {
        if (typeof(message) === 'string') {
            message = [message]
        }
    
        alert([...message, '자세한 내용은 개발자 도구를 열어 확인해주세요.', err].join('\n'))
        console.error(err)
    }

    /**
     * 특정 시간만큼 비동기로 대기합니다
     * @param {number} duration
     */
    static sleep (duration) {
        return new Promise(r => setTimeout(r, duration))
    }
}


class Gallery {
    /** @type {Object<string, GalleryType>} */
    static pathToType = {
        board: 'G',
        mgallery: 'M',
        mini: 'MI',
        person: 'PR'
    }

    /** @type {Object<string, GalleryPrefix>} */
    static pathToPrefixes = {
        mini: 'mi$',
        person: 'pr$'
    } 

    /**
     * @type {Object<GalleryType, string>}
     */
    static typeToSuffixes = {
        G: '갤러리',
        M: '마이너 갤러리',
        MI: '미니 갤러리',
        PR: '인물 갤러리'
    }

    /**
     * 갤러리나 갤러리에 작성된 글을 가르키는 주소로부터 갤러리 정보를 유추합니다
     * @param {string} url
     * @returns {Gallery}
     */
    static parseURL (url) {
        const parsedURL = new URL(url)
        const parsedFirstPath = parsedURL.pathname.split('/')[1]

        return new Gallery({
            id: parsedURL.searchParams.get('id'),
            idPrefix: this.pathToPrefixes[parsedFirstPath] ?? null,
            type: this.pathToType[parsedFirstPath] ?? ''
        })
    }

    /**
     * 요소의 dataset으로부터 갤러리 데이터를 가져옵니다
     * @param {DOMStringMap} dataset
     */
    static fromDataset (dataset) {
        return new Gallery({...dataset})
    }


    /**
     * @param {{
     *  id: string,
     *  idPrefix: ?GalleryPrefix,
     *  category: ?number,
     *  type: ?GalleryType,
     *  name: ?string
     * }} props
     */
    constructor (props) {
        // Object.assign(this, props) // fuck you vscode
        this.id = props.id
        this.idPrefix = props.idPrefix
        this.category = props.category
        this.type = props.type
        this.name = props.name
    }
    

    get suffix () {
        return Gallery.typeToSuffixes[this.type]
    }

    get displayName () {
        return `${this.name} ${this.suffix}`
    }

    get key () {
        return `${this.idPrefix}${this.id}.${this.type}`
    }

    get filterKey () {
        return `filter.gallery.${this.key}`
    }

    /**
     * @return {boolean}
     */
    get isFiltered () {
        return GM_getValue(this.filterKey, false)
    }

    /**
     * @type {boolean} state
     */
    set isFiltered (state) {
        if (state) {
            GM_setValue(this.filterKey, state)
        } else {
            GM_deleteValue(this.filterKey)
        }
    }

    /**
     * 갤러리 데이터를 요소의 dataset으로 내보냅니다
     * @param {DOMStringMap} dataset 
     */
    toDataset (dataset) {
        Object.assign(dataset, this)
    }
}


class Gallog {
    /**
     * @type {Gallery[]} 글 또는 댓글을 작성한 갤러리
     */
    usedGalleries = []

    /**
     * 현재 페이지가 본인의 갤로그 페이지인지?
     * @returns {boolean}
     */
    static get isMine () {
        return !!document.querySelector('.gallog_set_box')
    }

    /**
     * 로그인된 사용자 식별 코드를 현재 페이지로부터 가져옵니다
     * @returns {?string}
     */
    static get username () {
        const $anchor = document.querySelector('.user_data_list li:first-child a')
        if ($anchor) {
            const url = new URL($anchor.href)
            return url.pathname.split('/')[1]
        }

        return null
    }

    /**
     * 갤로그 정보를 새로고칩니다
     */
    async fetch () {
        const res = await Utils.fetch({
            url: `https://gallog.dcinside.com/${Gallog.username}/ajax/config_ajax/load_config`,
            method: 'POST',
            responseType: 'json'
        })

        this.usedGalleries = Object.fromEntries(
            res.response.use_galls.map(i => {
                const nameParts = i.name.split('$')
                return [
                    i.name,
                    new Gallery({
                        id: nameParts.pop(),
                        idPrefix: nameParts.length > 0 ? nameParts.pop() + '$' : null,
                        category: parseInt(i.cno),
                        type: i.gall_type,
                        name: i.ko_name
                    })
                ]
            })
        )
    }
}


class CaptchaService {
    /**
     * @param {string} endpoint 
     * @param {string} clientKey
     */
    constructor(name, endpoint) {
        this.name = name
        this.endpoint = endpoint
    }
    
    /** @returns {?string} */
    get clientKey () {
        return GM_getValue(`captcha.${this.name}.token`, null)
    }

    /** @param {?string} newClientKey */
    set clientKey (newClientKey) {
        if (typeof(newClientKey) === 'string') {
            newClientKey = newClientKey.trim()
        }

        if (newClientKey) {
            GM_setValue(`captcha.${this.name}.token`, newClientKey.trim())
        } else {
            GM_deleteValue(`captcha.${this.name}.token`)
        }
    }

    /**
     * https://2captcha.com/api-docs/recaptcha-v3#recaptchav3taskproxyless-task-type-specification  
     * https://anti-captcha.com/apidoc/task-types/RecaptchaV3TaskProxyless
     * @param {string} type 캡챠 종류 (RecaptchaV2TaskProxyless, RecaptchaV3TaskProxyless 등)
     * @param {string} websiteURL 캡챠가 표시된 웹 페이지의 주소
     * @param {string} websiteKey 캡챠가 표시된 웹 페이지의 캡챠 클라이언트 키
     * @param {number} retries 최대 재시도 횟수
     * @param {number} timeout 작업 대기 시간
     * @returns {Promise<() => Promise<string>>}
     */
    createSimpleSolver (type, websiteURL, websiteKey, retries = -1, timeout = 10000) {
        return () => 
            this.createTask(type, websiteURL, websiteKey)
                .then(async ({ taskId }) => {
                    let response
                    while (!response && retries-- !== 0) {
                        await Utils.sleep(timeout)

                        const result = await this.getTaskResult(taskId)
                        console.debug('CaptchaService', {
                            serviceName: this.name, 
                            taskId,
                            result
                        })

                        if (!result) {
                            throw new Error('캡챠 서비스에서 예측하지 못한 결과를 반환했습니다')
                        }

                        if (result.errorId > 0) {
                            throw new Error(`캡챠 서비스에서 ${result.errorId} 오류를 반환했습니다`)
                        }

                        if (result.status === 'ready') {
                            response = result?.solution?.gRecaptchaResponse
                        }
                    }

                    if (retries === 0) {
                        throw new Error('캡챠 풀이를 너무 많이 시도했습니다')
                    }
                    
                    return response
                })
    }

    async request (path, body = {}) {
        if (!('clientKey' in body)) {
            body.clientKey = this.clientKey
        }

        const res = await Utils.fetch({
            url: `${this.endpoint}${path}`,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify(body),
            responseType: 'json'
        })

        const result = res.response
        if ('errorId' in result && result.errorId > 0) {
            throw Error(`${result.errorId}: ${result?.errorDescription}`)
        }

        return result
    }

    async createTask (type, websiteURL, websiteKey) {
        return await this.request('/createTask', {
            task: { type, websiteURL, websiteKey }
        })
    }

    async getTaskResult(taskId) {
        return await this.request('/getTaskResult', { taskId })
    }

    async getBalance() {
        return await this.request('/getBalance')
    }
}


class App {
    /**
     * 사용 가능한 캡챠 서비스
     */
    static captchaServices = [
        new CaptchaService(
            '2Captcha',
            'https://api.2captcha.com'
        ),
        new CaptchaService(
            'AntiCaptcha',
            'https://api.anti-captcha.com'
        )
    ]


    constructor () {
        GM_addStyle(`
            :root {
                --dcrmrf-wrapper-border-color: #ccc;
                --dcrmrf-wrapper-background-color: #fff;
                --dcrmrf-wrapper-foreground-color: #000;
        
                --dcrmrf-primary-background-color: #3b4890;
                --dcrmrf-primary-foreground-color: #ffffff;
        
                --dcrmrf-secondary-background-color:rgb(117, 121, 143);
                --dcrmrf-secondary-foreground-color: #ffffff;
        
                --dcrmrf-success-background-color:rgb(99, 136, 92);
                --dcrmrf-success-foreground-color: #ffffff;
                --dcrmrf-danger-background-color:rgb(177, 85, 85);
                --dcrmrf-danger-foreground-color: #ffffff;
            }
        
            .dcrmrf {
                z-index: 10;
                position: relative;
            }
            .dcrmrf:not(.on) > :not(a) {
                display: none;
            }
        
        
            .dcrmrf button {
                display: block;
                width: 100%;
                border-radius: 2px;
                padding: 1em;
                font-weight: bold;
                background-color: var(--dcrmrf-primary-background-color);
                color: var(--dcrmrf-primary-foreground-color);
            }
            .dcrmrf button.togglable {
                background-color: var(--dcrmrf-danger-background-color);
                color: var(--dcrmrf-danger-foreground-color);
            }
            .dcrmrf button.togglable.toggled {
                background-color: var(--dcrmrf-success-background-color);
                color: var(--dcrmrf-success-foreground-color);
            }
        
        
            .dcrmrf blockquote {
                margin: 0;
                padding: .5em;
                border-left: 5px solid rgba(0, 0, 0, 0.25);
                align-content: center;
                text-align: center;
                background-color: var(--dcrmrf-secondary-background-color);
                color: var(--dcrmrf-secondary-foreground-color);
            }
        
        
            .dcrmrf form {
                z-index: -1;
                position: absolute;
                top: calc(100% - 1px);
                width: 300%;
                border: 1px var(--dcrmrf-wrapper-border-color) solid;
                padding: 1em;
                background-color: var(--dcrmrf-wrapper-background-color);
                box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
            }
        
        
            .dcrmrf form footer {
                margin-top: 1em;
                text-align: right;
            }
            .dcrmrf form footer a {
                all: initial !important;
                font-size: 15px !important;
                font-weight: bold !important;
                text-decoration: underline !important;
                color: var(--dcrmrf-primary-background-color) !important;
                cursor: pointer !important;
            }
        
        
            .dcrmrf fieldset {
                border: 1px var(--dcrmrf-wrapper-border-color) solid;
                border-radius: 2px;
                padding: 1em;
            }
            .dcrmrf fieldset:not(:first-child) {
                margin-top: 1em;
            }
        
            .dcrmrf fieldset legend {
                padding: .25em;
                border-radius: 2px;
                background-color: var(--dcrmrf-primary-background-color);
                font-weight: bold;
                color: var(--dcrmrf-primary-foreground-color);
            }
        
            .dcrmrf fieldset > blockquote {
                grid-column: 1 / -1;
            }


            .dcrmrf-control {
                position: relative;
            }
        
            .dcrmrf-control button {
                font-size: 1rem;
            }
            .dcrmrf-control button h1 {
                font-size: 1.25rem;
            }
            .dcrmrf-control button p {
                font-size: .75rem;
            }
        
        
            .dcrmrf-galleries {
                resize: vertical;
                overflow: auto;
                margin-top: .5em;
                height: 200px;
                text-align: center;
            }

            .dcrmrf-galleries-control {
                margin: .5em 0;
                display: grid;
                grid-template: repeat(1, 1fr) / repeat(3, 1fr);
                grid-gap: .5em;
            }

            .dcrmrf-galleries.loading,
            .dcrmrf-galleries:empty:not(.loading) {
                align-content: center;
            }
            .dcrmrf-galleries.loading::after {
                content: '불러오는 중...'
            }
            .dcrmrf-galleries:empty:not(.loading)::after {
                content: '갤질이 부족하시네요...'
            }
        
            .dcrmrf-galleries button {
                margin: calc(.25em / 2);
                display: inline-block;
                width: auto;
                border-radius: 15px;
                padding: .5em 1em;
            }
            .dcrmrf-galleries button:not(.toggled) {
                text-decoration: line-through;
            }
            .dcrmrf-galleries button::after {
                content: ' 갤러리';
                font-size: 10px;
            }
            .dcrmrf-galleries button[data-type="M"]::after {
                content: ' 마이너 갤러리';
            }
            .dcrmrf-galleries button[data-type="MI"]::after {
                content: ' 미니 갤러리';
            }
            .dcrmrf-galleries button[data-type="PR"]::after {
                content: ' 인물 갤러리';
            }
        
        
            .dcrmrf-captcha,
            .dcrmrf-setting {
                display: grid;
                grid-template: repeat(2, 1fr) / repeat(2, 1fr);
                grid-gap: .5em;
            }
        `)

        /** @type {LogType} */
        this.type = location.href.includes('/posting')
            ? 'posting'
            : 'comment'

        this.gallog = new Gallog()
        this.createElements(GM_getValue('wrapper.opened', false))

        this.job = new Job(this)
    }

    get typeName () {
        switch (this.type) {
            case 'posting':
                return '게시글'
            case 'comment':
                return '댓글'
        }

        return '⊙﹏⊙' // ???
    }

    /**
     * 메뉴 요소를 삽입합니다
     * @param {boolean} openByDefault 즉시 메뉴를 열어둘지?
     * @returns {HTMLElement}
     */
    createElements (openByDefault = false) {
        // 이미 요소가 존재한다면 제거하기
        if (this?.$) {
            this.$.remove()
        }

        // 요소 생성하고 메뉴 목록에 추가하기
        this.$ = document.createElement('li')
        document
            .querySelector('.gallog_menu')
            .append(this.$)
        
        this.$.classList.add('dcrmrf')
        this.$.innerHTML = `
            <a href="#">클리너</a>
    
            <form>
                <fieldset class="dcrmrf-control">
                    <button>
                        <h1></h1>
                        <p></p>
                    </button>
                </fieldset>
                <fieldset class="dcrmrf-filter">
                    <legend>필터</legend>
                    <blockquote>
                        <p>특정 갤러리를 제외할 수 있습니다.</p>
                    </blockquote>
                    <div class="dcrmrf-galleries-control">
                        <button>모두 제외</button>
                        <button>모두 해제</button>
                        <button>새로고침</button>
                    </div>
                    <div class="dcrmrf-galleries"></div>
                </fieldset>
                <fieldset class="dcrmrf-captcha">
                    <legend>캡챠</legend>
                    <blockquote>
                        <p>빠르게 게시글이나 댓글을 삭제하면 캡챠가 발생할 수 있습니다.</p>
                        <p>아래 유료 서비스를 통해 캡챠 풀이를 자동화합니다.</p>
                    </blockquote>
                </fieldset>
                <fieldset class="dcrmrf-setting">
                    <legend>설정</legend>
                    <blockquote>
                        <p>설정을 내보내거나 가져옵니다.</p>
                    </blockquote>
                    <button class="import">가져오기</button>
                    <button class="export">내보내기</button>
                </fieldset>
                <footer>
                    <p><a href="https://gist.github.com/toriato/183e05071873ab95bc2ad9f63e1c0f63">dcrmrf</a> by <a href="https://github.com/toriato">toriato</a> with ❤️</p>
                </footer>
            </form>
        `


        const $controlButton = this.$.querySelector('.dcrmrf-control button')
        $controlButton.addEventListener('click', e => {
            e.preventDefault()

            this.job.running
                ? this.job.pause()
                : this.job.resume()
                    .then(() => {
                        alert('작업이 완료됐습니다.')
                    })
                    .catch(err => {
                        this.job.pause()
                        Utils.printError(err, `${this.typeName} 삭제 중 오류가 발생했습니다`)
                    })
        })
    
    
        // 작업 버튼 삽입하기
        $controlButton.querySelector('h1')
            .textContent = `${this.typeName} 클리너 실행`


        // 갤러리 필터 제어 버튼
        const $galleries = this.$.querySelector('.dcrmrf-galleries')
        const $galleriesControlButtons = this.$.querySelectorAll('.dcrmrf-galleries-control button')

        $galleriesControlButtons[0].addEventListener('click', e => {
            e.preventDefault()

            if (!confirm('갤러리를 모두 제외할까요?\n이 작업은 되돌릴 수 없습니다.')) {
                return
            }

            $galleries.querySelectorAll('button')
                .forEach($ => {
                    Gallery
                        .fromDataset($.dataset)
                        .isFiltered = true
                })

            $galleriesControlButtons[2].click()
        })

        $galleriesControlButtons[1].addEventListener('click', e => {
            e.preventDefault()

            if (!confirm('제외된 갤러리를 모두 해제할까요?\n이 작업은 되돌릴 수 없습니다.')) {
                return
            }

            $galleries.querySelectorAll('button')
                .forEach($ => {
                    Gallery
                        .fromDataset($.dataset)
                        .isFiltered = false
                })

            $galleriesControlButtons[2].click()
        })

        $galleriesControlButtons[2].addEventListener('click', e => {
            e.preventDefault()

            this.updateGalleryElements()
                .catch(err => 
                    Utils.printError(err, '갤러리 목록을 새로고치는 중 오류가 발생했습니다')
                )
        })
    
    
        // 캡챠 버튼 삽입하기
        for (const service of App.captchaServices) {
            const $button = document.createElement('button')
            $button.textContent = service.name
            $button.classList.add('togglable')
    
            // API 키가 존재한다면 버튼 색상 변경하기
            if (service.clientKey) {
                $button.classList.add('toggled')
            }
    
            $button.addEventListener('click', async function (e) {
                e.preventDefault()
    
                const previousClientKey = service.clientKey
                const nextClientKey = prompt(
                    [
                        `캡챠 풀이에 사용될 ${service.name} 서비스의 API 키 값을 입력해주세요.`,
                        `빈 값을 입력하면 해당 서비스를 비활성화합니다.`
                    ].join('\n'),
                    previousClientKey ?? ''
                )
    
                // 입력을 취소했다면 아무 작업도 하지 않기
                if (nextClientKey === null) {
                    return
                }
    
                service.clientKey = nextClientKey
    
                // 빈 키가 입력된 경우 서비스 비활성화하기
                if (!service.clientKey) {
                    if (this.classList.contains('toggled')) {
                        this.classList.remove('toggled')
                    }
                    return
                }
    
                try {
                    const response = await service.getBalance()
    
                    alert([
                        `입력 받은 API 키와 관련된 정보는 다음과 같습니다:`,
                        `- 서비스: ${service.name}`,
                        `- 엔드포인트: ${service.endpoint}`,
                        `- 크레딧: ${response.balance}`
                    ].join('\n'))
    
                    if (!this.classList.contains('toggled')) {
                        this.classList.add('toggled')
                    }
                } catch (err) {
                    // 오류 발생시 기존 키 되돌리기
                    service.clientKey = previousClientKey
                    Utils.printError(err, '캡챠 서비스 연결 중 오류가 발생했습니다.')
                    return
                }
            })
    
            this.$.querySelector('.dcrmrf-captcha').append($button)
        }
    
    
        // 가져오기 버튼 이벤트 추가하기
        this.$.querySelector('.dcrmrf-setting .import')
            .addEventListener('click', e => {
                e.preventDefault()
    
                const $file = document.createElement('input')
                $file.type = 'file'
                $file.accept = '.json, application/json'
                $file.addEventListener('change', e => {
                    $file.files[0].text()
                        .then(raw => {
                            const values = JSON.parse(raw)
                            GM_deleteValues(GM_listValues())
                            GM_setValues(values)
                            this.createElements(true)
                        })
                        .catch(err => 
                            Utils.printError(err, '설정 파일을 가져오는 중 오류가 발생했습니다.')
                        )
                })
    
                $file.click()
            })
    
    
        // 내보내기 버튼 이벤트 추가하기
        this.$.querySelector('.dcrmrf-setting .export')
            .addEventListener('click', e => {
                e.preventDefault()
                const values = JSON.stringify(GM_getValues(GM_listValues()))
    
                const $anchor = document.createElement('a')
                $anchor.href = `data:application/json;charset=utf-8,${encodeURIComponent(values)}`
                $anchor.download = `dcrmrf_${new Date().toJSON().slice(0, 10)}.json`
                $anchor.click()
            })
    
    
        // 좌측 사이드바 메뉴 이벤트 추가하기
        this.$.addEventListener('click', (e) => {
            if (e.target.nodeName !== 'A') {
                return
            }
    
            e.preventDefault()
            e.stopPropagation()
            
            if (this.$.classList.toggle('on')) {
                GM_setValue('wrapper.opened', true)

                // 갤러리 목록 새로고치기
                $galleriesControlButtons[2].click()
            } else {
                GM_deleteValue('wrapper.opened')
            }
        })
    
        // 메뉴 열어두기
        if (openByDefault) {
            this.$.querySelector(':scope > a').click()
        }
    
        return this.$
    }

    /**
     * 갤러리 목록을 새로고칩니다
     */
    async updateGalleryElements () {
        const $galleries = this.$.querySelector('.dcrmrf-galleries')

        // 이미 불러오는 중이면 무시하기
        if ($galleries.classList.contains('loading')) {
            return
        }

        $galleries.innerHTML = ''
        $galleries.classList.add('loading')

        try {
            await this.gallog.fetch()

            for (const gallery of Object.values(this.gallog.usedGalleries)) {
                const $item = document.createElement('button')
                gallery.toDataset($item.dataset)
                $item.innerHTML = gallery.name      // 갤러리 이름
                $item.title = `${gallery.name}`     // 갤러리 아이디
                $item.classList.add('togglable')
                $item.addEventListener('click', e => {
                    e.preventDefault()

                    if ($item.classList.toggle('toggled')) {
                        GM_deleteValue(gallery.filterKey)
                    } else {
                        GM_setValue(gallery.filterKey, true)
                    }
                })

                if (!GM_getValue(gallery.filterKey, false)) {
                    $item.classList.add('toggled')
                }

                $galleries.append($item)
            }
        } finally {
            $galleries.classList.remove('loading')
        }
    }
}


class Job {
    /**
     * @param {App} app
     */
    constructor (app) {
        this.app = app

        this.$title = app.$.querySelector('.dcrmrf-control button h1')
        this.$description = app.$.querySelector('.dcrmrf-control button p')

        let running
        Object.defineProperty(this, 'running', {
            get: () => running,
            set: value => {
                running = value

                if (value) {
                    this.$title.textContent = `${this.app.typeName} 클리너 중지`
                } else {
                    this.$title.textContent = `${this.app.typeName} 클리너 시작`
                }

                this.$description.textContent = ''
            }
        })

        this.running = false
        
        /**
         * 클리너 작업이 필요한 갤러리들 
         * @type {?Gallery[]} 
         */
        this.pendingGalleries = null

        /**
         * 클리너 작업이 필요한 로그들 
         * @type {?Logs} 
         */
        this.pendingLogs = null

        /**
         * 성공적으로 삭제한 로그 개수
         */
        this.deletedLogs = 0

        /**
         * 현재 페이지
         */
        this.page = 1

        /**
         * 현재 작업 중인 갤러리
         * @type {?Gallery}
         */
        this.currentGallery = null
        
        /**
         * 현재 작업 중인 로그
         * @type {?Log}
         */
        this.currentLog = null

        /**
         * 현재 작업에 사용할 캡챠 응답 값 (풀이 성공 시)
         * @type {?string}
         */
        this.currentCaptchaResponse = null
    }

    /**
     * 
     * @param {string} message 
     */
    print (message) {
        this.$description.textContent = message
    }

    /**
     * 갤로그 항목을 가져옵니다
     * @param {?Gallery} gallery
     * @returns {Promise<Logs>}
     */
    async fetchLogs (gallery = null) {
        const url = new URL(`https://gallog.dcinside.com/${Gallog.username}/${this.app.type}/index`)
        url.searchParams.set('page', this.page)
        url.searchParams.set('cno', gallery?.category ?? 0)

        const res = await Utils.fetch({ url })
        const $ = new DOMParser().parseFromString(res.response, 'text/html')

        /** @type {Logs} */
        const result = {
            totalCategoryCount: null,
            totalCount: parseInt($.querySelector('.cont_head .num').textContent.replace(/[^\d]/g, ''), 10),
            categories: [...$.querySelectorAll('.gallog [data-value]:not([data-value=""])')]
                .map($item =>
                    parseInt($item.dataset.value, 10)
                ),
            items: [...$.querySelectorAll('.cont_listbox li[data-no]')]
                .map($item => {
                    return {
                        gallery: Gallery.parseURL($item.querySelector('a.link').href),
                        id: parseInt($item.dataset.no, 10),
                        title: $item.querySelector('.galltit').textContent
                    }
                })
        }

        // 특정 갤러리 내 로그 수 가져오기
        if (gallery) {
            const $totalCategoryCount = $.querySelector('.cont_box .num')
            if ($totalCategoryCount) {
                result.totalCategoryCount = parseInt($totalCategoryCount.textContent.replace(/[^\d]/g, ''), 10)
            } else {
                result.totalCategoryCount = 0
                result.items = []
            }
        }

        return result
    }


    /**
     * 갤로그 항목을 삭제합니다
     */
    async deleteLog () {
        const data = new FormData()
        data.set('no', this.currentLog.id)
        if (this.currentCaptchaResponse) {
            data.set('g-recaptcha-response', this.currentCaptchaResponse)
        }

        const res = await Utils.fetch({
            url: `https://gallog.dcinside.com/${Gallog.username}/ajax/log_list_ajax/delete`,
            method: 'POST',
            headers: { 'X-Requested-With': 'XMLHttpRequest' },
            responseType: 'json',
            data
        })

        const result = res.response?.result
        const message = res.response?.msg
        if (result === 'success') {
            return
        }

        // 캡챠 입력이 필요할 때
        if (result === 'captcha') {
            throw new InvalidCaptchaError()
        }

        // 회신한 캡챠 결과가 일치하지 않을 때
        // TODO: 오류 따로 핸들링하기?
        if (result === 'fail' && message === 'g-recaptcha error!') {
            throw new InvalidCaptchaError()
        }

        throw new Error(message ?? res.response)
    }

    /**
     * 작업을 시작합니다
     */
    async resume () {
        if (this.running) {
            return
        }

        this.running = true

        // 모든 캡챠 서비스의 API 키가 유효한지 확인하기
        const captchaSolvers = []
        for (const service of App.captchaServices) {
            if (service.clientKey === null) {
                continue
            }

            this.print(`캡챠 서비스(${service.name}) 유효성 확인 중...`)

            try {
                await service.getBalance()
            } catch (err) {
                Utils.printError(err, '캡챠 서비스가 유효하지 않습니다, API 키를 다시 확인해보세요')
                throw err
            }
            
            captchaSolvers.push(
                service.createSimpleSolver(
                    'RecaptchaV2TaskProxyless',
                    'https://gallog.dcinside.com/',
                    '6LcJyr4UAAAAAOy9Q_e9sDWPSHJ_aXus4UnYLfgL'
                )
            )
        }

        this.print('갤로그 정보 새로고치는 중...')
        await this.app.updateGalleryElements()
        
        if (this.pendingGalleries === null) {
            this.print(`${this.app.typeName} 작성된 갤러리 목록 가져오는 중...`)
            
            const { categories } = await this.fetchLogs()
            
            this.pendingGalleries = Object
                .values(this.app.gallog.usedGalleries)
                .filter(gallery => 
                    !gallery.isFiltered && categories.includes(gallery.category)
                )
        }

        let iter = 0
        while (this.running) {
            iter++

            if (this.currentGallery === null) {
                // 작업할 갤러리가 남아있지 않는다면 작업 마치기
                if (this.pendingGalleries.length < 1) {
                    this.pendingGalleries = null
                    this.pendingLogs = null
                    this.currentGallery = null
                    this.currentLog = null
                    this.currentCaptchaResponse = null
                    this.deletedLogs = 0
                    break
                }

                this.currentGallery = this.pendingGalleries.pop()
            }

            // 작업할 로그가 아예 존재하지 않는다면 초기화하기
            if (this.pendingLogs === null) {
                this.print(`${this.currentGallery.displayName}에 작성된 로그 가져오는 중...`)
                this.pendingLogs = await this.fetchLogs(this.currentGallery)
            }

            // 작업할 로그가 남아있지 않는다면 새로고치기
            if (this.pendingLogs.items.length < 1) {
                // 현재 갤러리에 로그가 남아있지 않다면 다음 갤러리로 넘어가기
                if (!this.pendingLogs.totalCategoryCount) {
                    this.currentGallery = null
                    this.deletedLogs = 0
                }

                this.pendingLogs = null
                this.currentLog = null
                this.currentCaptchaResponse = null
                continue
            }

            if (this.currentLog === null) {
                this.currentLog = this.pendingLogs.items.pop()
            }

            const prefix = `${this.currentGallery.displayName}의 ${this.app.typeName} ${this.pendingLogs.totalCategoryCount}개 중 ${this.deletedLogs + 1}번`

            this.print(`${prefix} 삭제 중...`)
            console.debug(
                `${prefix} 삭제 중...`,
                this.currentGallery,
                this.currentLog
            )

            try {
                await this.deleteLog()
                await Utils.sleep(1000) // TODO: 설정으로 제어하기
            } catch (err) {
                // 캡챠 발생시 유효한 캡챠 서비스가 있을 경우
                if (err instanceof InvalidCaptchaError && captchaSolvers.length > 0) {
                    this.print(`${prefix} 캡챠 풀이 중...`)
                    console.debug(
                        `${prefix} 캡챠 풀이 중...`,
                        this.currentGallery,
                        this.currentLog
                    )

                    this.currentCaptchaResponse = await captchaSolvers[iter % captchaSolvers.length]()
                    continue
                }

                throw err
            }

            this.deletedLogs++
            this.currentLog = null
            this.currentCaptchaResponse = null
        }

        await this.pause()
    }

    /**
     * 작업을 일시 정지합니다
     */
    async pause () {
        this.running = false
    }
}


if (Gallog.isMine) {
    new App
}
