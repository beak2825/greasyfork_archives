(function() {
    var listPageDocument = document; // 缓存列表页的 `document`
    
    // 保存该 `document` 为一个全局变量
    window.listPageDocument = listPageDocument;
    // 初始化一个局部函数来操作列表页的 DOM
    function operateOnListPage(data) {
        console.log('dqdocument',window.listPageDocument)
        const listItems = document.querySelectorAll('.list-item');
        listItems.forEach(item => {
            if (item.textContent.includes(data.itemName)) {
                item.style.display = 'none';  // 根据数据隐藏对应项
            }
        });
    }

    // 监听来自其他页面的数据传递
    window.addEventListener('message', function(event) {
        if (event.data && event.data.type === 'dataFromDetailPage') {
            console.log('Received data from detail page:', event.data);
            operateOnListPage(event.data);  // 处理列表页的 DOM
        }
    });

    // 监听页面获取焦点时，确保操作的是列表页的 document
    window.addEventListener('focus', function() {
        console.log('List page is focused. Now operating on list page document.');
    });
})();