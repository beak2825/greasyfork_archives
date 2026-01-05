// ==UserScript==
// @name        S.O. Rep Optimizer
// @namespace   yourmom.com
// @description Get your most delete-worth answers and questions
// @include     http://stackoverflow.com*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/25106/SO%20Rep%20Optimizer.user.js
// @updateURL https://update.greasyfork.org/scripts/25106/SO%20Rep%20Optimizer.meta.js
// ==/UserScript==

/**
 * This script will retrieve a deletelist of your own answers and questions which have 
 * either lost or not gained you any reputation and are older than 7 days. 
 * deletelist is sorted by 1) Points lost, if any. 2) Older before newer.
 */

(function () {

    if(!$(".profile-me").length){
        console.log("Login to use S.O. Rep Optimizer");
        return;
    }
    
    var requestLimit = 1000;
    var deletelist = [];
    var zerolist = [];
    var upvotelist = [];
    var username = "";
    var profileurl = "http://stackoverflow.com" + $(".profile-me").attr("href");
    var lastRequestTime = 0;
    
	function main() { 
        if((""+window.location).indexOf("docheck")<0) 
            return "Rep check not requested.";
        
        $("head").append('<link rel="stylesheet" type="text/css" href="//cdn.datatables.net/1.10.12/css/jquery.dataTables.min.css">');
        $("head").append('<script src="//cdn.datatables.net/1.10.12/js/jquery.dataTables.min.js"></script>');
        var title = '<br><div id="question-header"><h1 itemprop="name"><a class="question-hyperlink" href="javascript: void(0);">Rep Optimizer</a></h1></div>';
        var loader = 'data:image/gif;base64,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';
        $("body").html('<div style="margin: 1em 5em"><div id="hlogo"><a href="javascript:void(0);"> Stack Overflow </a></div><div style="clear:both;"></div><br>'+title+'<br><div id="sodcontent"><img src="'+loader+'" /><br><br><p>Gathering data. This may take several minutes. <ul></ul></p></div></div>');
        $("title").text("Stack Overflow Rep Optimizer");
        
        getMyUsername()
		.then(getQuestions)
        .then(checkQuestions)
        .then(getAnswers)
        .then(checkAnswers)
		.then(sortAndFilter)
        .then(drawUI);
		return "Running Rep check";
	}
    
    function drawUI(){
        $("#soddisplay").remove();
        
        var html = [];
        html.push("<h3>Delete List</h3>");
        html.push("<p>These questions and answers are cost points due to downvotes. Delete these posts to recover lost points.</p>");
        html.push("<table id='dtab'><thead><tr><th>Type</th><th>Title</th><Th>Rep Change</th><th>Views/Week</th><Th>Age</th></tr></thead><tbody>");
        for(var i=0; i<deletelist.length; i++)
            html.push("<tr><td>"+deletelist[i].type.toUpperCase()+"</td><td><a href='"+deletelist[i].url+"' target='_blank'>"+deletelist[i].title+"</a></td><Td>"+deletelist[i].points+"</td><Td>"+(deletelist[i].type=='q'?(Math.floor(deletelist[i].popularity*10000)/10000):'N/A')+"</td><Td>"+Math.floor(deletelist[i].age/1000/60/60/24)+" days</td></tr>");
        if(!deletelist.length) html.push("<tr><td colspan='6'>No results to show</td></tr>");
        html.push("</tbody></table><br><br>");
        
        html.push("<h3>Accept List</h3>");
        html.push("<p>These are questions which have unaccepted answers. Accept answer to recieve rep.</p>");
        html.push("<table id='atab'><thead><tr><th>Type</th><th>Title</th><Th>Rep Change</th><th>Views/Week</th><Th>Age</th></tr></thead><tbody>");
        for(var i=0; i<upvotelist.length; i++)
            html.push("<tr><td>"+upvotelist[i].type.toUpperCase()+"</td><td><a href='"+upvotelist[i].url+"' target='_blank'>"+upvotelist[i].title+"</a></td><Td>"+upvotelist[i].points+"</td><Td>"+(upvotelist[i].type=='q'?(Math.floor(upvotelist[i].popularity*10000)/10000):'N/A')+"</td><Td>"+Math.floor(upvotelist[i].age/1000/60/60/24)+" days</td></tr>");
        if(!upvotelist.length) html.push("<tr><td colspan='6'>No results to show</td></tr>");
        html.push("</tbody></table><br><br>");
        
        html.push("<h3>Zero List</h3>");
        html.push("<p>Questions and answers that have neither gained nor lost reputation. Review for quality.</p>");
        html.push("<table id='ztab'><thead><tr><th>Type</th><th>Title</th><Th>Rep Change</th><th>Views/Week</th><Th>Age</th></tr></thead><tbody>");
        for(var i=0; i<zerolist.length; i++)
            html.push("<tr><td>"+zerolist[i].type.toUpperCase()+"</td><td><a href='"+zerolist[i].url+"' target='_blank'>"+zerolist[i].title+"</a></td><Td>"+zerolist[i].points+"</td><Td>"+(zerolist[i].type=='q'?(Math.floor(zerolist[i].popularity*10000)/10000):'N/A')+"</td><Td>"+Math.floor(zerolist[i].age/1000/60/60/24)+" days</td></tr>");
        if(!zerolist.length) html.push("<tr><td colspan='6'>No results to show</td></tr>");
        html.push("</tbody></table><br><br>");
        
        $("#sodcontent").html(html.join(''));
        $('#dtab').DataTable();
        $('#atab').DataTable();
        $('#ztab').DataTable();
    }
    
    function sortAndFilter(){
        return new Promise(function(done){
            display("Sorting and filtering results...");
            upvotelist = deletelist.filter(function(a){
                return a.points + a.potential > -1 && a.potential > 0;
            }).sort(function(a,b){
                if(a.type=="q"&&b.type=="q"&&a.popularity!==b.popularity) return a.popularity < b.popularity ? -1 : 1;
                if(a.age!==b.age) return a.age < b.age ? -1 : 1;
                if(a.type!==b.type) return a.type == "q" ? -1 : 1;
                return 0;
            });

            zerolist = deletelist.filter(function(a){
                return a.points === 0 && a.potential === 0;
            }).sort(function(a,b){
                if(a.popularity!==b.popularity) return a.popularity < b.popularity ? -1 : 1;
                if(a.age!==b.age) return a.age > b.age ? -1 : 1;
                if(a.type!==b.type) return a.type == "q" ? -1 : 1;
                return 0;
            });

            deletelist = deletelist.filter(function(a){
                return a.points + a.potential < 0;
            }).sort(function(a, b){
                if(a.points!==b.points) return a.points < b.points ? -1 : 1;
                if(a.potential!==b.potential) return a.potential < b.potential ? -1 : 1;
                if(a.type=="q"&&b.type=="q"&&a.popularity!==b.popularity) return a.popularity < b.popularity ? -1 : 1;
                if(a.age!==b.age) return a.age < b.age ? -1 : 1;
                if(a.type!==b.type) return a.type == "q" ? -1 : 1;
                return 0;
            });
            
            done();
        });
    }
    
    function checkAnswers(answers){
        return new Promise(function(done){
            (function recurse(index){
                var answer = answers[index];
                if(undefined===answer){
                    for(var i=answers.length; i--;) 
                        deletelist.push(answers[i]);
                    done();
                    return;
                }
                
                var seconds = (answers.length-index)*requestLimit/1000;
                seconds += (answers.length-index)*(lastRequestTime/1000);
                var sec = Math.floor(seconds%60);
                if(sec<10)sec="0"+sec;
                display("%"+(Math.floor((1+index)/answers.length*10000)/100)+" ~"+(Math.floor(seconds/60)+":"+sec)+" mins remaining - <b>Getting votes for answer: <i>"+answer.title+"</i></b>");
                
                var aid = answer.url.split("#").pop();
                var t = Date.now();
                $.ajax({
                    url: "http://stackoverflow.com/posts/"+aid+"/vote-counts?_="+Date.now() 
                }).done(function(r){
                    lastRequestTime = lastRequestTime === 0 ? Date.now() - t : (lastRequestTime + Date.now() - t) / 2;
                    var upvotes = parseInt(r.up);
                    var dnvotes = Math.abs(r.down);
                    var gained = upvotes * 10; // 10pts for a upvote
                    var lost = dnvotes * 2; // 2pts for a downvote
                    var points = gained - lost;
                    answers[index].points += points;
                    if(!$(".acounter2").length) $("ul").append("<li>Analysed <b class='acounter2'>"+(index+1)+"</b> answers</li>");
                    else $(".acounter2").html(index+1);
                    setTimeout(function(){ recurse(index+1); }, requestLimit);
                });
            })(0);
        });
    }
    
    function getAnswers(){
        return new Promise(function(done){
            var answers = [];
            (function recurse(page){
                display("Loading answers: <b>page "+page+"</b>");
                var url = profileurl + "?tab=answers";
                if(page > 1) url += "&page="+page;
                $.ajax({
                    url: url
                }).done(function (r) {
                    var $qs = $(r).find(".answer-hyperlink");
                    if($qs.length){
                        $qs.each(function(){
                            var lastActive = $(this).parent().parent().find(".relativetime").attr("title");
                            var age = new Date().getTime() - new Date(lastActive).getTime();
                            var accpted = !!$(this).parent().parent().find(".answered-accepted").length;
                            answers.push({
                                url: "http://stackoverflow.com"+$(this).attr('href'),
                                title: $(this).text().replace(/</g, "&lt;"),
                                type: "a",
                                points: accpted ? 15 : 0,
                                potential: 0,
                                popularity: 0,
                                age: age
                            });
                        });
                        if(!$(".acounter").length) $("ul").append("<li>Found <b class='acounter'>"+answers.length+"</b> answers</li>");
                        else $(".acounter").html(answers.length);
                        setTimeout(function(){ recurse(page+1); }, requestLimit);
                    }else done(answers);
                });
            })(1);
        });
    }
    
    function checkQuestions(questions){
        return new Promise(function(done){
            (function recurse(index){
                var question = questions[index];
                if(undefined===question){
                    for(var i=questions.length; i--;) 
                        deletelist.push(questions[i]);
                    done();
                    return;
                }
                
                var seconds = (questions.length-index)*requestLimit/1000;
                seconds += (questions.length-index)*(lastRequestTime/1000);
                var sec = Math.floor(seconds%60);
                if(sec<10)sec="0"+sec;
                display("%"+(Math.floor((1+index)/questions.length*10000)/100)+" ~"+(Math.floor(seconds/60)+":"+sec)+" mins remaining - <b>Getting votes for question: <i>"+question.title+"</i></b>");
                var qid = question.url.split('/')[4];
                var t = Date.now();
                $.ajax({
                    url: "http://stackoverflow.com/posts/"+qid+"/vote-counts?_="+Date.now() 
                }).done(function(r){
                    lastRequestTime = lastRequestTime === 0 ? Date.now() - t : (lastRequestTime + Date.now() - t) / 2;
                    var upvotes = parseInt(r.up);
                    var dnvotes = Math.abs(r.down);
                    var gained = upvotes * 5; // 5pts for q upvote
                    var lost = dnvotes * 2; // 2pts for q downvote
                    var points = gained - lost;
                    questions[index].points += points;
                    
                    if(!$(".qcounter2").length) $("ul").append("<li>Analysed <b class='qcounter2'>"+(index+1)+"</b> questions</li>");
                    else $(".qcounter2").html(index+1);
                    
                    setTimeout(function(){ recurse(index+1); }, requestLimit);
                });
            })(0);
        });
    }
    
	function getQuestions() {
        return new Promise(function(done){
            var questions = [];
            (function recurse(page){
                display("Loading questions: <b>page "+page+"</b>");
                var url = profileurl + "?tab=questions";
                if(page > 1) url += "&page="+page;
                $.ajax({
                    url: url
                }).done(function (r) {
                    var $qs = $(r).find(".question-hyperlink");
                    if($qs.length){
                        $qs.each(function(){
                            var lastActive = $(this).parent().parent().parent().find(".relativetime").attr("title");
                            var age = new Date().getTime() - new Date(lastActive).getTime();
                            var weeks = age / 1000 / 60 / 60 / 24 / 7;
                            var views = parseInt($(this).parent().parent().parent().find(".views").find('.mini-counts').text());
                            var acnt = parseInt($(this).parent().parent().parent().find(".status").find('.mini-counts').text());
                            var accpted = !!$(this).parent().parent().parent().find(".answered-accepted").length;
                            questions.push({
                                url: "http://stackoverflow.com"+$(this).attr('href'),
                                title: $(this).text().replace(/</g, "&lt;"),
                                type: "q",
                                points: accpted ? 2 : 0,
                                potential: acnt > 1 && !accpted ? 2 : 0,
                                popularity: views / weeks,
                                age: age
                            });
                        });
                        
                        if(!$(".qcounter").length) $("ul").append("<li>Found <b class='qcounter'>"+questions.length+"</b> questions</li>");
                        else $(".qcounter").html(questions.length);
                        
                        setTimeout(function(){ recurse(page+1); }, requestLimit);
                    }else done(questions);
                });
            })(1);
        });
	}
    
    function getMyUsername() {
        return new Promise(function(done){
            display("<b>Fetching username...</b>");
            $.ajax({
                url: profileurl
            }).done(function (r) {
                username = $(r).find(".name").text().trim();
                done();
            });
        });
	}
    
    function display(html){
        if(!$("#soddisplay").length)
            $("body").prepend("<div style='background:#437DCC; border-bottom:1px solid black; font-size:105%; padding:.25em;' id='soddisplay'></div>");
        $("#soddisplay").html(html);
    }
    
	return main();

})();