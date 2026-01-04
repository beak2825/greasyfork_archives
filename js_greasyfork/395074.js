
    function copy(value) {
        let transfer = document.createElement('input');
        document.body.appendChild(transfer);
        transfer.value = value;  // 这里表示想要复制的内容
        //transfer.focus();
        transfer.select();
        if (document.execCommand('copy')) {
            document.execCommand('copy');
        }
        //transfer.blur();
        console.log('复制成功:',value);
        document.body.removeChild(transfer);
    }

    //copy图片到剪切板
    function copyImage(img=''){
        img = img || document.getElementsByTagName('img')[0];
        if(img == undefined){
            console.log('img not exits');
            return ;
        }
        img.removeAttribute('alt');
        var range = document.createRange();
        range.selectNode(img);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        document.execCommand("Copy");
        window.getSelection().removeAllRanges();
       console.log('复制成功:',img.src);
    }

