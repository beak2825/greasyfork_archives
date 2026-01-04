(function() {
    'use strict';
 //console.log('ceshi')
    // Your code here...
    function jxbf(){
    if(document.getElementsByClassName('btn-ok btn').length){
    document.getElementsByClassName('btn-ok btn')[0].click()
        console.log('点击成功')
    };
    if(document.getElementsByClassName('btn')[0].innerText=="继续学习"){
       window.close()
       }
       };
setInterval(jxbf, 15000);
//点开未完成-10分钟一次
    function wwc(){
        let x = document.getElementsByClassName('ms-train-state')
       for(var i = 0;i < x.length;i++ ){
        if(x[i].innerText=="未完成"){
            console.log(i)
        document.getElementsByClassName('m-bottom mb title-row pointer title-font')[i].click()
            location.reload();
            break;}
        };
    };
  setInterval(wwc, 600000);
})();