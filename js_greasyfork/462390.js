// ==UserScript==
// @name         Naurok Test Solver
// @namespace    nauroktestsolverr
// @version      0.4
// @description  Скрипт для решения тестов наурок
// @author       flora1324
// @match        https://naurok.ua/*
// @match        https://naurok.com.ua/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462390/Naurok%20Test%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/462390/Naurok%20Test%20Solver.meta.js
// ==/UserScript==
var messages_history = []
document.onkeydown = function(e){
    if(e.keyCode != 32){return}
    var question_block = document.querySelector(".test-content-text-inner")
    var question = ""
    var variants = document.querySelectorAll(".question-option-inner-content")
    var request_text = ""
    var multiple_variants = document.querySelector(".question-option-inner-multiple")!=null
    if(multiple_variants){
        request_text+= "Виберіть правильні твердження з наведених нижче варіантів\nТобі потрібно записати відповідь в такому вигляді:\n true - для правильних варіантів\n false - для не правильних варіантів\nНаприклад:\nа) true\nб) true\nв) false\nг) true\nЗавдання:\n"
    }else{
        request_text+="Виберіть одне правильне твердження з наведених нижче варіантів\nТобі потрібно записати відповідь в такому вигляді:\nНаприклад:\nг)\nЗавдання:\n"
    }
    for(var t = 0; t<question_block.children.length; t++){
        question+=question_block.children[t].innerHTML+"\n"
    }
    request_text+= question+"\n"
    var alphabet = ['а', 'б', 'в', 'г', 'д', 'е', 'ё', 'ж', 'з', 'и', 'й', 'к', 'л', 'м', 'н', 'о', 'п', 'р', 'с', 'т', 'у', 'ф', 'х', 'ц', 'ч', 'ш', 'щ', 'э', 'ю', 'я'];
    for(var x = 0; x<variants.length; x++){
        request_text+=alphabet[x]+") "+variants[x].children[0].innerHTML+"\n"
    }
    var rExp = new RegExp("<em>", "g");
    request_text = request_text.replace(rExp, '"')
    rExp = new RegExp("</em>", "g");
    request_text = request_text.replace(rExp, '"')
    rExp = new RegExp("&nbsp;", "g");
    request_text = request_text.replace(rExp, ' ')
    rExp = new RegExp("<strong>", "g");
    request_text = request_text.replace(rExp, '')
    rExp = new RegExp("</strong>", "g");
    request_text = request_text.replace(rExp, '')
    rExp = new RegExp("<u>", "g");
    request_text = request_text.replace(rExp, '')
    rExp = new RegExp("</u>", "g");
    request_text = request_text.replace(rExp, '')
    messages_history.push({"role": "user", "content": request_text})
    console.log("Request text:\n"+request_text)
    question_block.innerHTML+="<br>Загрузка..."
    for(var y = 0; y<variants.length; y++){
                variants[y].children[0].style.border = "none"
    }
    const data = JSON.stringify({
        "model": "gpt-3.5-turbo",
        'messages': messages_history
    });
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;

    xhr.addEventListener("readystatechange", function () {
        if (this.readyState === this.DONE) {
            console.log("Response JSON:\n"+this.responseText);
            var response_json = JSON.parse(this.responseText)
            var response_text = response_json["choices"][0]["message"]["content"].toLowerCase()
            console.log("Response text:\n"+response_text)
            //
            messages_history.push({"role": "assistant", "content": response_text})
            var true_exist = null
            if(multiple_variants){
                question_block.innerHTML+="<br>Відповідь: "+ response_text
                messages_history+={"role": "user", "content": request_text}
                console.log("True answers:\n")
                for(var x = 0; x<variants.length; x++){
                    if(response_text.includes(alphabet[x]+") true")){
                        true_exist = x
                        variants[x].children[0].style.border = "2px solid red"
                        variants[x].parentElement.children[0].click()
                        console.log(variants[x].children[0].innerHTML)
                    }
                }
            }else{
                question_block.innerHTML+="<br>Відповідь: "+ response_text
                for(var x = 0; x<variants.length; x++){
                    if(response_text.includes(alphabet[x]+") ")){
                        true_exist = x
                        variants[x].children[0].style.border = "2px solid red"
                        console.log("True answer:\n"+variants[x].children[0].innerHTML)
                    }
                }
            if (true_exist == null){
                alert("Не вдалося вибрати жоден варіант")
            }
            //
        }
    }else{
        console.log(this.readyState)
    }
    })
    xhr.open("POST", "https://api.openai.com/v1/chat/completions", true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.setRequestHeader("Authorization", "Bearer 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");

    xhr.send(data)
}


