
console.log(GM_info); 
GM_xmlhttpRequest({
  url: "https://www.baidu.com",
  method: "HEAD",
  onload: function(response) {
    console.log(response.responseHeaders);
  }
});

try
{
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://www.baidu.com/",
    headers: {
      "User-Agent": "Mozilla/5.0",    // If not specified, navigator.userAgent will be used.
      "Accept": "text/xml"            // If not specified, browser defaults will be used.
    },
    onload: function(response) {
      var responseXML = null;
      // Inject responseXML into existing Object (only appropriate for XML content).
      if (!response.responseXML) {
        responseXML = new DOMParser()
          .parseFromString(response.responseText, "text/xml");
      }

      console.log([
        response.status,
        response.statusText,
        response.readyState,
        response.responseHeaders,
        response.responseText,
        response.finalUrl,
        responseXML
      ].join("\n"));
    }
  });
  
    /*console.log( GM_xmlhttpRequest( {
        method: "GET", 
        url: "https://www.baidu.com/", 
        //  synchronous: true 不支持
      } 
    ).readyState );*/
}
catch (e)
{
    console.log(e);
}

try
{
  console.log('收录查询工具 v1');

  if(location.href.indexOf('exam_formal')>-1) {
        let reg2 = '/,/g';
        let preCount =0, count = 0;
        const id = location.href.match(reg)[1];
        $.get('http://cplatform.kingdee.com/queryQuestionByCourseId?id=' + id, function(res){
            if(res.rows){
                for(let i = 0; i < res.rows.length; i++) {
                    let myAnswer = '';
                    let myOptions =[];
                    const options = res.rows[i].optionList;
                    let answer = '';
                    for (let j = 0; j < options.length; j++) {
                        myOptions.push(options[j].content.replace(reg2, '，'));
                        myAnswer += (options[j].isQuestionAnswer === 1) ? ((answer ? ',' : '') + String.fromCharCode(65 + j)) : '';
                    }
                    GM_xmlhttpRequest({
                        method: "post",
                        url: 'http://192.168.0.109:8080/subject',
                        data: 'typeName=【' + id + '】' + res.data.title + '&content=' +res.rows[i].title + '&answer='+myAnswer+'&options=' +JSON.stringify(myOptions),
                        headers:  {
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        onload: function(res){
                            if(res.status === 200){
                                console.log('成功')
                            }else{
                                console.log('失败')
                                console.log(res)
                            }
                        },
                        onerror : function(err){
                            console.log('error')
                            console.log(err)
                        }
                    });
                }
                // 用于在页面上显示参考答案
                $('.col-xs-12').bind('DOMSubtreeModified', function(e){
                    count++;
                    setTimeout(function(){
                        if(preCount !== count){
                            preCount = count;
                        }else{
                            $('.col-xs-12').unbind('DOMSubtreeModified');
                            $('.look_answer_exam').show();
                        }
                    },100);
                });
            }
        });
              
}
}
catch (e){
    console.log(e);
}
