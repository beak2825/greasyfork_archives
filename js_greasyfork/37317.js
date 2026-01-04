(function(){
  $("body").prepend("<div id='wusdiv'></div>")
})();

function addtextag(callback,dtext='......',id='wusinput',btext="Start"){
     $("#wusdiv").append(`<textarea rows="3" cols="80" id='${id}'>${dtext}</textarea>&nbsp;&nbsp;<button id='b${id}'>${btext}</button></br>`)
     $(`#b${id}`).click(function(){
       val=$(`#${id}`).val()
       if(val==dtext){
         alert("you can input some vaild text for youself!")
         return
       }
       console.log(`get the val: "${val}" ,then and run the callback`)
       callback(val)
     })
}

function addfiletag(callback,id='wusfile'){
    $("#wusdiv").append(`<input type="file" id="${id}"/></br>`)

    $(`#${id}`).change(function(){
        callback(this.files)
    })
}