// ==UserScript==
// @name         arXiv-highlight-concerned-authors
// @namespace    http://tampermonkey.net/
// @version      0.3.15
// @description  when browse papers from arxiv.org, automate highlight concerned authors
// @author       csxz
// @match        https://arxiv.org*
// @include      https://arxiv.org*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453323/arXiv-highlight-concerned-authors.user.js
// @updateURL https://update.greasyfork.org/scripts/453323/arXiv-highlight-concerned-authors.meta.js
// ==/UserScript==
 
function autoHighlight() {
    var authors_list = ['Quanshi Zhang', 'Yi Ma', 'Geoffrey Hinton', 'Yoshua Bengio', 'Yann LeCun', 'Kaiming He', 'Ross Girshick', 'Piotr Dollar', 'Bolei Zhou',
    'Weinan E', 'Licheng Jiao', 'Jie Zhou', 'Ming-Ming Cheng', 'Chunhua Shen', 'Xiang Bai', 'Gao Huang', 'Zhiguo Cao', 'Lingxi Xie', 'Xiangyu Zhang', 'Dacheng Tao',
    'Xiaoou Tang', 'Dahua Lin', 'Ali Borji', 'Cong Yao', 'Quoc V. Le', 'Shuicheng Yan', 'Jeff Dean', 'Tieniu Tan', 'Xinggang Wang', 'Xiaogang Wang', 'Huchuan Lu',
    'Jingdong Wang', 'Gui-Song Xia', 'Jifeng Dai', 'Nong Sang', 'Changxin Gao', 'Zhuang Liu', 'Li Fei-Fei', 'Jiaya Jia', 'Jiwen Lu'];
    
    var jc_abbrs = ['WACV', 'NeurIPS', 'ECCV', 'CVPR', 'ICCV', 'BMVC', 'WACV', 'ICLR']
    
    // find all authors
    var authors = document.getElementsByTagName('a');
    
    for (var i=0; i<authors.length;i++)
    {
        var author = authors[i].innerText;
        
        for (var j=0; j<authors_list.length;j++)
        {
            if (author == authors_list[j])
            {
                authors[i].style.color = 'white';
                authors[i].style.background = '#030';
            }
        }
    }
    
    // find all Comments
    highlighttext('list-comments mathjax', jc_abbrs, 'yellow')
    
    /*
    var comms = document.getElementsByClassName('list-comments mathjax');
    
    for (var s=0; s<comms.length;s++)
    {
        comm = comms[s].innerHTML;
        
        for (var t=0; t<jc_abbrs.length;t++)
        {
            var pos = comm.toLowerCase().indexOf(jc_abbrs[t].toLowerCase())
            if (pos > -1)
            {
                str = "<font style='background-color:yellow'>" + jc_abbrs[t] + "</font>";
                var newcomm = '';
                
                newcomm += comm.substring(0,pos) + str;
                newcomm += comm.substring(pos+jc_abbrs[t].length)
                
                comms[s].innerHTML = newcomm
            }
        }
    }
    */
    
    // find in 'list-journal-ref'
    highlighttext('list-journal-ref', jc_abbrs, 'yellow')
}

function highlighttext(objclass, kvals, color)
{
    // find all Comments
    var comms = document.getElementsByClassName(objclass);
    
    for (var s=0; s<comms.length;s++)
    {
        var comm = comms[s].innerHTML;
        
        for (var t=0; t<kvals.length;t++)
        {
            var pos = comm.toLowerCase().indexOf(kvals[t].toLowerCase())
            if (pos > -1)
            {
                var str = "<font style='background-color:" + color + "'>" + kvals[t] + "</font>";
                var newcomm = '';
                
                newcomm += comm.substring(0,pos) + str;
                newcomm += comm.substring(pos+kvals[t].length)
                
                comms[s].innerHTML = newcomm
            }
        }
    }
}

window.onload = autoHighlight;