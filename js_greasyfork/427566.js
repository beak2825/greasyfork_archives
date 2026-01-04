// ==UserScript==
// @name         河北工程大学urp教务系统自动评教
// @namespace    http://www.baifan97.cn/
// @version      0.25
// @description  自动选择“非常符合”并自动随机填写主观评价，2分钟后自动提交
// @author       WhiteFan
// @match        http://27.188.65.169:*/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        http://202.206.161.203:*/student/teachingEvaluation/teachingEvaluation/evaluationPage
// @match        */student/teachingEvaluation/*
// @license      MIT
// @icon         https://ypy.baifan97.cn//typecho/uploads/pic/icon.png
// @icon64       https://ypy.baifan97.cn//typecho/uploads/pic/icon64.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/427566/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6urp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/427566/%E6%B2%B3%E5%8C%97%E5%B7%A5%E7%A8%8B%E5%A4%A7%E5%AD%A6urp%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $(document).ready(function () {

        //自动选择"非常符合"
        var keyWord=["非常符合"];
        $(".ace").each(function(){
            var self=$(this);
            var text=$(this).next().next().html();
            keyWord.forEach(function(value){
                if(text.indexOf(value)!=-1)
                    self.click();
            });
            console.log(text);
        })
     //自定义随机评语内容
     var list = [
        '教学内容重点突出，教学目的十分明确，教师具有极高的专业技能。 授课方式新颖别致，激起同学们的兴趣，教师很注重互动，课堂学习氛围轻松愉快，真正达到了教学的目的要求。',
        '教师的教学效果极佳，可以使同学在领略知识魅力的同时提高自己实际技能。',
        '教师教课内容广大博深，高质量，高效率。教课内容新颖，独特，有个性。',
        '教师教学在书面浅显知识的基础上，进一步扩大了教学的知识的深度及广度，扩大了学生知识面，并且多方面培养学生的思考问题的能力，教师的知识渊博，因此讲授的很有深度，并且在书本知识上也有所扩展。',
        '教师通过对课本的独到深入的讲解，达到了很好的教学效果，能结合多种教学手段，使学生对知识的掌握更深刻。',
        '教师的教学效果非常好，学生对老师授课的内容有较深的理解，教师授课内容深入广泛，精彩的语言使学生十分投入。另外，教师授课的立意十分吸引人，方式创新，同时，师生间的互动也使课程的效果有明显的提高。',
        '教学整体效果较好，课堂气氛也很活跃，在程度上也做了较好的拓展，使学生对所学内容有更深了解，并且，授课内容所选择的角度，即切入点新颖，很有新意，能充分吸引学生的注意力，符合学生的学习兴趣，所以师生间有较好的互动，营造了良好的课堂氛围，尤其是教师讲课的风格灵活，语言幽默，生动，深得学生喜爱，而且也非常的注重学生实际操作的培养。',
        '教师上课认真负责，专业基础极技能高深，非常注重学生的实际动手能力。老师常常告诫学生，书法要从心开始，勤于练习。注重学生专业能力和素养的培养。上课语言幽默，互动适当，演示精准精彩。',
        '课堂氛围轻松的活跃，积极调动了学生的兴趣。课程设置合理，深浅知宜，实际操作多，教学效果好，且授课内容新颖，独到，有自己的特色，能很好的启发、带动学生的思维。立意新，大大地启发了学生的创造性思维。',
        '教师通过对文章的独到深入的讲解，达到了很好的教学效果，知识系统深入，并能结合多种教学手段，使学生对知识的掌握更深刻。',
        '教师课堂上的整体教学效果好，教师的基本专业技能过硬，因此，在课上所达到的效果是很好的，指导具有针对性，使同学更容易获得提高。',
        '教师通过对文章的独到深入的讲解，达到了很好的教学效果，知识系统的深入，并能结合多种教学手段，使学生对知识的掌握更深刻。',
        '教学内容重点突出，教学目的十分明确，教师所具备的知识达到了较深的程度，广博的学识使学生学习到了更多。主题立意新颖别致，激起同学们的兴趣，教师很注重互动，师生交流频繁，课堂学习氛围轻松愉快，学习者在教师的引领下既能充分吸收新知识，又有大的思维发展空间，真正达到了教学的目的要求。',
        '授课内容所选择的角度，即切入点新颖，很有新意，能充分吸引学生的注意力，符合学生的学习兴趣，所以师生间有较好的互动，营造了良好的课堂氛围，尤其是教师讲课风格灵活，语言幽默，生动，深得学生喜爱，而且也非常注重学生独立思考的培养。',
        '教师能以饱满的精神为学生讲每一堂课。在授课过程中，教师所讲的内容能够吸引学生的注意力，从所讲知识的一点，拓宽到一连串的多个知识点，并能从广度中求深度，用提问题的方示，让学生对问题进行深刻思考，形成教师与学生的互动关系。'];
     var randomNumber = function(n) {
        return Math.floor(Math.random() * n);
    };

        var fillingForm = function() {
        var n = list.length;

        $("textarea").each(function(i, obj) {
            $(obj).val(list[randomNumber(n)]);
        });

    };
        //两分钟后提交
        setTimeout(function(){$("#buttonSubmit").click()},1000*60*2.1);


    });
})();