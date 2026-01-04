// ==UserScript==
// @name         Rust 翻译文档 std/index.html
// @namespace    fireloong
// @version      0.0.5
// @description  翻译文档 std/index.html
// @author       Itsky71
// @match        https://doc.rust-lang.org/std/index.html
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rust-lang.org
// @require      https://unpkg.com/jquery@3.7.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/503008/fanyi.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496704/Rust%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20stdindexhtml.user.js
// @updateURL https://update.greasyfork.org/scripts/496704/Rust%20%E7%BF%BB%E8%AF%91%E6%96%87%E6%A1%A3%20stdindexhtml.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    const translates = {
        'Deprecation planned': '弃用计划',
        'Experimental': '实验',
        'Deprecated': '废弃',
        'The Rust Standard Library is the foundation of portable Rust software, a\nset of minimal and battle-tested shared abstractions for the broader Rust\necosystem. It offers core types, like Vec<T> and\nOption<T>, library-defined operations on language\nprimitives, standard macros, I/O and\nmultithreading, among many other things.': 'Rust 标准库是可移植 Rust 软件的基础，是为<a href="https://crates.io">更广泛的 Rust 生态系统</a>提供的一组最小且经过实战测试的共享抽象。它提供核心类型，如 <a href="vec/struct.Vec.html" title="struct std::vec::Vec"><code>Vec&lt;T&gt;</code></a> 和 <a href="option/enum.Option.html" title="enum std::option::Option"><code>Option&lt;T&gt;</code></a>，库定义的<a href="#primitives">语言基元</a>、<a href="#macros">标准宏</a>、<a href="io/index.html" title="mod std::io">I/O</a> 和 <a href="thread/index.html" title="mod std::thread">多线程</a>等<a href="#what-is-in-the-standard-library-documentation">其它</a>操作。',
        'std is available to all Rust crates by default. Therefore, the\nstandard library can be accessed in use statements through the path\nstd, as in use std::env.': '默认情况下，所有 Rust 词条都可以使用 <code>std</code>。因此，在 <a href="../book/ch07-02-defining-modules-to-control-scope-and-privacy.html"><code>use</code></a> 语句中可以通过路径 <code>std</code> 访问标准库，就像在 <a href="env/index.html"><code>use std::env</code></a> 中一样。',
        'If you already know the name of what you are looking for, the fastest way to\nfind it is to use the search\nbar at the top of the page.': '如果你已经知道你要找的内容的名称，最快的方式是使用页面顶部的<a href="#" onclick="window.searchState.focus();">搜索栏</a>。',
        'Otherwise, you may want to jump to one of these useful sections:': '否则，你可能会想跳转到以下这些有用的章节之一：',
        'std::* modules': '<a href="#modules"><code>std::*</code> 模块</a>',
        'Primitive types': '<a href="#primitives">原始类型</a>',
        'Standard macros': '<a href="#macros">标准宏</a>',
        'The Rust Prelude': '<a href="prelude/index.html" title="模块 std::prelude">Rust 预导库</a>',
        'If this is your first time, the documentation for the standard library is\nwritten to be casually perused. Clicking on interesting things should\ngenerally lead you to interesting places. Still, there are important bits\nyou don’t want to miss, so read on for a tour of the standard library and\nits documentation!': '如果是你第一次接触，Rust 的标准库文档是设计成可供随意浏览的形式。点击感兴趣的内容通常会带你到有趣的地方。不过，仍有一些重要的部分你不容错过，所以请继续阅读，接下来是对标准库及其文档的概览！',
        'Once you are familiar with the contents of the standard library you may\nbegin to find the verbosity of the prose distracting. At this stage in your\ndevelopment you may want to press the [-] button near the top of the\npage to collapse it into a more skimmable view.': '一旦你熟悉了标准库的内容，你可能会觉得大量的文字描述有些分散注意力。在这个阶段，你可以点击页面顶部附近的 <code>[-]</code> 按钮，将其折叠成更容易快速浏览的视图。',
        'While you are looking at that [-] button also notice the source\nlink. Rust’s API documentation comes with the source code and you are\nencouraged to read it. The standard library source is generally high\nquality and a peek behind the curtains is often enlightening.': '当你看到那个 <code>[-]</code> 按钮时，也请注意旁边的源代码链接。Rust 的 API 文档附带了源代码，鼓励你去阅读它。标准库的源代码通常质量很高，窥探其背后的实现往往是非常有启发性的。',
        'First of all, The Rust Standard Library is divided into a number of focused\nmodules, all listed further down this page. These modules are\nthe bedrock upon which all of Rust is forged, and they have mighty names\nlike std::slice and std::cmp. Modules’ documentation typically\nincludes an overview of the module along with examples, and are a smart\nplace to start familiarizing yourself with the library.': '首先，Rust 标准库被划分为多个专注的模块，<a href="#modules">所有这些模块都列在本页下方</a>。这些模块是 Rust 的基础基石，它们有着诸如 <a href="slice/index.html" title="mod std::slice"><code>std::slice</code></a> 和 <a href="cmp/index.html" title="mod std::cmp"><code>std::cmp</code></a> 这样强有力的名字。模块的文档通常包括模块概述以及示例，是开始熟悉这个库的好地方。',
        'Second, implicit methods on primitive types are documented here. This can\nbe a source of confusion for two reasons:': '其次，<a href="../book/ch03-02-data-types.html" target="_blank">原始类型</a>的隐式方法在这里有文档说明。这可能会因为两个原因导致混淆：',
        'While primitives are implemented by the compiler, the standard library\nimplements methods directly on the primitive types (and it is the only\nlibrary that does so), which are documented in the section on\nprimitives.': '虽然原始类型是由编译器实现的，但标准库在原始类型上直接实现了方法（并且它是唯一这样做库），这些方法<a href="#primitives">在原始类型的章节中有详细的文档说明</a>。',
        'The standard library exports many modules with the same name as\nprimitive types. These define additional items related to the primitive\ntype, but not the all-important methods.': '标准库导出了许多与原始类型同名的模块。这些模块定义了与原始类型相关的附加项，但并不包括那些至关重要的方法。',
        'So for example there is a page for the primitive type\ni32 that lists all the methods that can be called on\n32-bit integers (very useful), and there is a page for the module\nstd::i32 that documents the constant values MIN and MAX (rarely\nuseful).': '例如，有一个<a href="primitive.i32.html" title="primitive i32" target="_blank">关于原始类型 <code>i32</code> 的页面</a>，列出了所有可以在 32 位整数上调用的方法（非常有用），还有一个<a href="i32/index.html" title="mod std::i32" target="_blank">关于模块 <code>std::i32</code> 的页面</a>，记录了常量值 <a href="i32/constant.MIN.html" title="constant std::i32::MIN" target="_blank"><code>MIN</code></a> 和 <a href="i32/constant.MAX.html" title="constant std::i32::MAX" target="_blank"><code>MAX</code></a>（较少使用）。',

        'A fixed-size array, denoted [T; N], for the element type, T, and the\nnon-negative compile-time constant size, N.': '固定大小的数组 <code>[T; N]</code> 表示，对于元素类型，<code>T</code>，以及非负的编译时常量大小 <code>N</code>',
        'The boolean type.': '布尔类型',
        'A character type.': '字符类型',
        'A 32-bit floating-point type (specifically, the “binary32” type defined in IEEE 754-2008).': '32 位浮点类型(具体来说，是 IEEE 754-2008 中定义的“binary32”类型)',
        'A 64-bit floating-point type (specifically, the “binary64” type defined in IEEE 754-2008).': '64 位浮点类型(具体来说，是 IEEE 754-2008 中定义的“binary64”类型)',
        'Function pointers, like fn(usize) -> bool.': '函数指针，如 <code>fn(usize) -&gt; bool</code>',
        'The 8-bit signed integer type.': '8 位有符号整数类型',
        'The 16-bit signed integer type.': '16 位有符号整数类型',
        'The 32-bit signed integer type.': '32 位有符号整数类型',
        'The 64-bit signed integer type.': '64 位有符号整数类型',
        'The 128-bit signed integer type.': '128 位有符号整数类型',
        'The pointer-sized signed integer type.': '指针大小的有符号整型',
        'Raw, unsafe pointers, *const T, and *mut T.': '原始的、不安全的指针，<code>*const T</code> 和 <code>*mut T</code>',
        'A dynamically-sized view into a contiguous sequence, [T]. Contiguous here\nmeans that elements are laid out so that every element is the same\ndistance from its neighbors.': '一个指向连续序列的动态尺寸视图，<code>[T]</code>。这里的连续意味着元素的布局方式是每个元素与其邻近元素之间的距离相同',
        'String slices.': '字符串切片',
    };

    fanyi(translates, '.docblock p, .docblock li,.section-header,.item-table .desc,.stab.deprecated,.stab.unstable', true);

    const translates2 = {
        '#the-rust-standard-library': ['The Rust Standard Library', 'Rust 标准库'],
        '#how-to-read-this-documentation': ['How to read this documentation', '如何阅读本文档'],
        '#what-is-in-the-standard-library-documentation': ['What is in the standard library documentation?', '标准库文档中包含了什么'],
        '#contributing-changes-to-the-documentation': ['Contributing changes to the documentation', '对文档贡献更改'],
        '#a-tour-of-the-rust-standard-library': ['A Tour of The Rust Standard Library', 'Rust 标准库概览'],
        '#use-before-and-after-main': ['Use before and after <code>main()</code>', '在 <code>main()</code> 函数之前和之后使用'],
        '#primitives': ['Primitive Types', '原始类型'],
        '#modules': ['Modules', '模块'],
        '#macros': ['Macros', '宏'],
        '#keywords': ['Keywords', '关键字'],
    };

    fanyi_jing(translates2);
})($);
