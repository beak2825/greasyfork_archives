// ==UserScript==
// @name old good lk
// @namespace old blood
// @description old blood
// @match *://lk.mango-office.ru/*
// @grant none
// @version 0.0.1.20190912080222
// @downloadURL https://update.greasyfork.org/scripts/390052/old%20good%20lk.user.js
// @updateURL https://update.greasyfork.org/scripts/390052/old%20good%20lk.meta.js
// ==/UserScript==

(($) => {
  $(document).ready(() => {
    var div_rt = document.createElement('div');
    div_rt.id = "modal_rm_text";
    div_rt.setAttribute('style','transition: 1.5s; font-size: 24px; padding-top: 15px; display: block; height: 300px; width: 400px; position: fixed; bottom: 30%; right: 0%; z-index: 30; text-align: center;');
    document.getElementsByTagName('body')[0].appendChild(div_rt);
    var dialog_t = document.getElementById('modal_rm_text');
    document.getElementById('modal_rm_text').innerHTML = '<a href="https://lk-old.mango-office.ru/">В старый лк</a>';
    var div_cb = document.createElement('div');
    div_cb.id = "modal_close_button";
    div_cb.setAttribute('onclick', 'document.getElementById("modal_rm_text").style.display = "none"');
    div_cb.setAttribute('style','padding: 3px; right: 0; top: 0; width: 24px; height: 24px; position: absolute; background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABcAAAAXCAQAAABKIxwrAAAABGdBTUEAALGPC/xhBQAAACBjSFJNAAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QAAKqNIzIAAAAJcEhZcwAADdcAAA3XAUIom3gAAAAHdElNRQfjAhQOOgDWiKNXAAABlUlEQVQ4y4XUvU+TURQG8F9bJjbSmhiJ0kQdXECMm4CixMSJb938F/w/DPK5i7obraNxIaaLFVxwYjBGygRJm0CiQ9/jgNL3bUHPHU7uc55z7nPPyb05acsbNWnMBUUH9myo+Cicavdtia61aaKb2mNFCA3PzRkyYMicdQ0hLCpkye+EliXFjjJFyxKhkk5YEQ5Nna7RtENhqa05tM4kw4xEuHfcja107hm2KnyW47bQyGju6fBQ0hRG86bw2sFJ4IFtZfSpenyC7nuDSWrCbKrytrBj0Bfhu96TyLzwiT3heurYfjtCIuy6msKHhTq/hIuZaw1KhHAng14SfnZX71P7M/5vyin8hrCbV8eVlPYPbqobt6PsfUr7ZdR5JqynqjzywzWc99WTFP5KeMpYV997Ozyc0xRGyNsUlv8z1TWhJgcTQsv0P8izEmH873ZRODJzJvlIWGgDBRUhsarUQS1Zkwhvsw+kYFEITS/MGzZg2EMvNYWwkCUf2y3VU95qzd02JZdJyBkxaUy/kn11Gyqq6Z/gNycgoUpO0KWUAAAAJXRFWHRkYXRlOmNyZWF0ZQAyMDE5LTAyLTIwVDEzOjU4OjAwKzAxOjAwjmONUgAAACV0RVh0ZGF0ZTptb2RpZnkAMjAxOS0wMi0yMFQxMzo1ODowMCswMTowMP8+Ne4AAAAZdEVYdFNvZnR3YXJlAHd3dy5pbmtzY2FwZS5vcmeb7jwaAAAAAElFTkSuQmCC); background-position: center center; background-repeat: no-repeat;');
    document.getElementById('modal_rm_text').appendChild(div_cb);
  });
})(jQuery);