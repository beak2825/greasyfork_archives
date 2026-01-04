// ==UserScript==
// @name        kpolyakovsolver
// @license     MIT
// @namespace   Violentmonkey Scripts
// @match       *://kpolyakov.spb.ru/school/test*
// @run-at      document-end
// @grant       none
// @version     0.5alpha
// @author      sh411
// @description Script for automatic kpolyakov tests completion
// @downloadURL https://update.greasyfork.org/scripts/457054/kpolyakovsolver.user.js
// @updateURL https://update.greasyfork.org/scripts/457054/kpolyakovsolver.meta.js
// ==/UserScript==


const is_str = (object) => 
    typeof object === "string" || object instanceof String

const background_window_open = (url) => {
    window.open(url)
    while (true) {
        try {
            window.open().close()
        } catch (err) {
            continue
        }
        break;
    }
}

const search_in_google = (query) => {
    const google_url = "https://www.google.com/search?q="
    background_window_open(google_url + query)
}

const get_nested_parent = (tag, level) => {
    for (let i = 0; i != level; ++i) {
        tag = tag.parentElement
    }
    return tag
}

const get_nested_children = (tag, level) => {
    for (let i = 0; i != level; ++i) {
        tag = tag.children[0]
    }
    return tag
}

const get_text_question = (text_element) => {
    let tbody_tag = get_nested_parent(text_element, 3)
    let div_tag = get_nested_children(tbody_tag, 3)
    return div_tag.innerText
}

const show_popup = (html) => {
    hidePopup()
    let screenXandY = getPageScroll();
    const cover = document.getElementById("cover");
    disable_scroll();
    document.body.style.overflow = "hidden";
    cover.style.visibility = "visible";
    cover.style.left = screenXandY.left + "px";
    cover.style.top = screenXandY.top + "px";
    const msg = document.getElementById("msg");
    // this is where message is modified
    msg.innerHTML = "<h1>KPolyakovSolver</h1>" + html;
    const popup = document.getElementById("popup");
    
    let width = 
        window.innerWidth
        || document.documentElement.clientWidth
        || document.body.clientWidth;
    
    let height = 
        window.innerHeight 
        || document.documentElement.clientHeight 
        || document.body.clientHeight;
    
    popup.style.left = 
        screenXandY.left + (width - popup.offsetWidth).div(2) + "px";
    
    popup.style.top = 
        screenXandY.top + (height - popup.offsetHeight).div(2) + "px";
    
    popup.style.visibility = "visible";
}

class API {
    constructor() {
        this.gateway = new URL("https://kpolyakovsolverapi.s3rv3rmanag3r.repl.co/api")
        this.password = "Ih@tej4v@scr1pt"
    }

    async construct_options(question, answer = undefined) {
        return new Promise((resolve, reject) => {
            let error = {
                message: "Wrong data type",
            }
            let data = {
                password: this.password,
            }
            if (!is_str(question)) {
                error.value = question
                reject(error)
            } else {
                data.hash = question
            }
            if (answer) {
                if (!is_str(answer)) {
                    error.value = answer
                    reject(error)
                }
                data.answer = answer
            }
            let options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data)
            }
            resolve(options)
        })
    }

    async call(question, answer = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                const options = await this.construct_options(question, answer)
                let response = await fetch(this.gateway, options)
                resolve(response.json())
            } catch (err) {
                reject(err)
            }
        })
    }
}

const input = {
    elements: document.getElementsByTagName("input"),
    text: () => {
        return new Promise((resolve) => {
            let text_elements = []
            for (element of input.elements) {
                if (element.type === "text") {
                    text_elements.push(element)
                }
            }
            resolve(text_elements)
        })
    },
    values: () => {
        return new Promise(async (resolve) => {
            let value_elements = []
            for (element of input.elements) {
                if (element.value === "1") {
                    value_elements.push(element)
                }
            }
            resolve(value_elements)
        })
    }
}

const option = {
    elements: document.getElementsByTagName("option"),
    values: () => {
        return new Promise(async (resolve) => {
            let value_elements = []
            for (element of option.elements) {
                if (element.value === "1") {
                    value_elements.push(element)
                }
            }
            resolve(value_elements)
        })
    }
}

const fill_text_inputs = async (api) => {
    return new Promise(async (resolve) => {
        if (!api instanceof API) {
            reject()
        }
        for (text_ of await input.text()) {
            let question = get_text_question(text_)
            // let json = await api.call(question)
            let json = null
            try {
                json = await api.call(question)
            } catch (err) {
                reject(err)
            }
            if (json.message.toLowerCase() === "no answer") {
                search_in_google(question)
            } else {
                text_.value = json.message
                text_.onfocus()
            }
            if (text_ === (await input.text()).reverse()[0]) {
                resolve()
            }
        }
    })
}

const fill_input_values = async () => {
    return new Promise(async (resolve, reject) => {
        if ((await input.values()).length === 0) {
            resolve()
        }
        for (value_ of await input.values()) {
            value_.checked = true
            if (value_ === (await input.values()).reverse()[0]) {
                resolve()
            }
        }
    })
}

const fill_options_values = async () => {
    return new Promise(async (resolve, reject) => {
        if ((await option.values()).length === 0) {
            resolve()
        }
        for (element of await option.values()) {
            element.selected = true
            if (element === (await option.values()).reverse()[0]) {
                resolve()
            }
        }
    })
}

const submit_btn_inject = async (api) => {
    let check_answers_mod = (form) => {
        let check = checkAnswers(form)
        hidePopup()
        show_popup(
            "<h2>Загружаю ответы....</h2>" +
            "Загружаю ответы в базу данных...." +
            "<h2>ВНИМАНИЕ!</h2>" +
            "1. Эта процедура может занять некоторое время<br>" +
            "2. Не закрывай это окно " + 
            "(да, мне слишком лень вырезать кнопку " +
            "\"Закрыть\")!"
        )
        return check
    }
    let submit_button = document.getElementById("submit-btn")
    submit_button.onclick = (event) => {
        // magic call to alter the msg.innerText
        checkAnswers(this.form)
        // payload goes here
        let msg = document.getElementById("msg")
        if (!msg.innerText.includes("Результат: 100 баллов из 100.")) {
            return checkAnswers(this.form)
        }
        let promise = new Promise(async (resolve, reject) => {
            if ((await input.values()).length === 0) {
                resolve()
            }
            for (text_ of await input.text()) {
                let question = get_text_question(text_)
                // let json = await api.call(question, text_.value)
                let json = null
                try {
                    json = await api.call(question, text_.value)
                } catch (err) {
                    reject(err)
                }
                console.log(json)
                if (text_ === (await input.text()).reverse()[0]) {
                    resolve()
                }
            }
        })
        promise.then(() => {
            hidePopup()
            checkAnswers(this.form)
        })
        return check_answers_mod(this.form)
    }
}

this.kpolyakovsolver_algorithm = async () => {
    show_popup(
        "<h2>Решаю тест....</h2>" +
        "Ищу ответы в базе данных...." +
        "<h2>ВНИМАНИЕ!</h2>" +
        "1. Эта процедура может занять некоторое время<br>" +
        "2. Не закрывай это окно " + 
        "(да, мне слишком лень вырезать кнопку " +
        "\"Закрыть\")!"
    )
    try {
        await fill_text_inputs(new API())
        await fill_input_values()
        await fill_options_values()
    } catch (err) {
        console.err(err)
    } finally {
        hidePopup()
    }
}

(async function main() {
    console.log(
        "пожалуйста, сожгите создателя джаваскрипта " +
        "на костре. заранее спасибо"
    )
    show_popup(
        "<h2>Как пользоваться</h2>" +
        "Нажми \"Решить\" если хочешь решить тест автоматически;<br>" +
        "Нажми \"Закрыть\" если хочешь решить тест самостоятельно.<br>" +
        "<input id=\"close-btn\" type=\"button\" value=\"Решить\" " +
        "onclick=\"kpolyakovsolver_algorithm()\">"
    )
    await submit_btn_inject(new API())
})()
