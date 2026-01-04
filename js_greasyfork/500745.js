// ==UserScript==
// @name         Symfony 翻译文档 controller/forwarding.html
// @namespace    fireloong
// @version      0.1.4
// @description  翻译文档 controller/forwarding.html
// @author       Itsky71
// @match        https://symfony.com/doc/5.x/controller/forwarding.html
// @match        https://symfony.com/doc/6.4/controller/forwarding.html
// @match        https://symfony.com/doc/7.1/controller/forwarding.html
// @match        https://symfony.com/doc/7.2/controller/forwarding.html
// @match        https://symfony.com/doc/current/controller/forwarding.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=symfony.com
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500745/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerforwardinghtml.user.js
// @updateURL https://update.greasyfork.org/scripts/500745/Symfony%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20controllerforwardinghtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        '\n        \n                    How to Forward Requests to another Controller\n        \n            ': '如何将请求转发到另一个控制器',
        'Though not very common, you can also forward to another controller internally\nwith the forward() method provided by the\nAbstractController\nclass.': '尽管不常见，但您还可以使用 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Bundle/FrameworkBundle/Controller/AbstractController.php" class="reference external" title="Symfony\Bundle\FrameworkBundle\Controller\AbstractController" rel="external noopener noreferrer" target="_blank">AbstractController</a> 类提供的 <code translate="no" class="notranslate">forward()</code> 方法在内部将请求转发到另一个控制器。',
        'Instead of redirecting the user\'s browser, this makes an "internal" sub-request\nand calls the defined controller. The forward() method returns the\nResponse object that is returned\nfrom that controller:': '而不是重定向用户的浏览器，这会发起一个“内部”子请求并调用定义的控制器。<code translate="no" class="notranslate">forward()</code> 方法返回从该控制器返回的 <a href="https://github.com/symfony/symfony/blob/'+doc_version+'/src/Symfony/Component/HttpFoundation/Response.php" class="reference external" title="Symfony\Component\HttpFoundation\Response" rel="external noopener noreferrer" target="_blank">Response</a> 对象：',
        'The array passed to the method becomes the arguments for the resulting controller.\nThe target controller method might look something like this:': '传递给该方法的数组会成为结果控制器的参数。目标控制器方法可能如下所示：',
        "Like when creating a controller for a route, the order of the arguments of the\nfancy() method doesn't matter: the matching is done by name.": '就像为路由创建控制器时一样，<code translate="no" class="notranslate">fancy()</code> 方法的参数顺序并不重要：匹配是通过名称进行的。',
    };

    fanyi(translates, 1);
})($);
