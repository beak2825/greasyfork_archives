// ==UserScript==
// @name        Smartphone Camera Review
// @description A quick review of the best smartphone cameras currently available, focusing on photo, video capabilities, and creative features.
// @match       *://*/*
// @include     *://*/*
// @version     1.0
// @grant       none
// @namespace https://greasyfork.org/users/1423047
// @downloadURL https://update.greasyfork.org/scripts/523724/Smartphone%20Camera%20Review.user.js
// @updateURL https://update.greasyfork.org/scripts/523724/Smartphone%20Camera%20Review.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log("Bắt đầu đánh giá các dòng điện thoại có camera tốt nhất hiện nay!");

    const review = `
        <h2>Đánh giá nhanh các dòng điện thoại có camera tốt nhất hiện nay</h2>
        <p>Dựa trên khả năng chụp ảnh, quay video và tính năng hỗ trợ sáng tạo, dưới đây là những gợi ý đáng chú ý:</p>
        <ol>
            <li><strong>iPhone 15 Pro Max:</strong> 
                <ul>
                    <li>Cảm biến 48MP, zoom quang học lên đến 5x.</li>
                    <li>Photonic Engine và Deep Fusion giúp hình ảnh chi tiết, màu sắc tự nhiên.</li>
                    <li>Hỗ trợ quay video 4K ProRes, phù hợp cho nhà sáng tạo nội dung.</li>
                </ul>
            </li>
            <li><strong>Google Pixel 8 Pro:</strong> 
                <ul>
                    <li>Thuật toán AI xuất sắc, cảm biến chính 50MP, góc siêu rộng 48MP.</li>
                    <li>Tính năng Magic Editor và Night Sight cho hình ảnh đẹp trong mọi điều kiện ánh sáng.</li>
                </ul>
            </li>
            <li><strong>Samsung Galaxy S23 Ultra:</strong> 
                <ul>
                    <li>Camera chính 200MP, zoom quang học 10x, zoom kỹ thuật số lên đến 100x.</li>
                    <li>HDR xuất sắc, chế độ Nightography phù hợp với ảnh thiên nhiên và chân dung.</li>
                </ul>
            </li>
            <li><strong>Xiaomi 13 Ultra:</strong> 
                <ul>
                    <li>Sử dụng cảm biến 1 inch của Sony, hỗ trợ thu sáng vượt trội.</li>
                    <li>Hệ thống 4 camera đa tiêu cự, lý tưởng cho sáng tạo nhiếp ảnh.</li>
                    <li>Chi tiết: <a href="https://slides.com/danhgianhanh">https://slides.com/danhgianhanh</a></li>
                </ul>
            </li>
            <li><strong>Sony Xperia 1 V:</strong> 
                <ul>
                    <li>Cảm biến Exmor T, giao diện chuyên dụng như máy ảnh DSLR.</li>
                    <li>Hỗ trợ quay video 4K HDR tốc độ cao.</li>
                    <li>Chi tiết: <a href="https://stocktwits.com/danhgianhanh">https://stocktwits.com/danhgianhanh</a></li>
                </ul>
            </li>
        </ol>
        <p>Kết luận: <a href="https://danhgianhanh.org/">Đánh giá nhanh</a> các dòng điện thoại trên cho thấy sự vượt trội về chất lượng camera và tính năng sáng tạo. iPhone 15 Pro Max và Pixel 8 Pro phù hợp với người dùng cân bằng giữa tính năng và AI. Galaxy S23 Ultra và Xiaomi 13 Ultra thiên về thông số kỹ thuật mạnh mẽ, còn Xperia 1 V lý tưởng cho nhiếp ảnh gia chuyên sâu.</p>
    `;

    document.body.innerHTML = review;
    console.log("Đánh giá đã được hiển thị trên trang.");
})();
