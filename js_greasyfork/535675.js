// ==UserScript==
// @name        lấy danh sách anime animevietsub
// @namespace   Violentmonkey Scripts
// @version     1.3
// @author      Elaina Da Catto
// @description 4/29/2025, 1:09:34 AM
// @license MIT
// @grant       none
// @include     /^https:\/\/animevietsub\.[a-z]+\/.*$/
// @downloadURL https://update.greasyfork.org/scripts/535675/l%E1%BA%A5y%20danh%20s%C3%A1ch%20anime%20animevietsub.user.js
// @updateURL https://update.greasyfork.org/scripts/535675/l%E1%BA%A5y%20danh%20s%C3%A1ch%20anime%20animevietsub.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    // Hàm chèn nút mới vào dưới "Hộp phim"
    function chenNutTaiDanhSach() {
        // Menu ở cạnh icon account
        const danhSachMenu = document.querySelectorAll('.Login ul li');
        if (danhSachMenu.length === 0) {
            console.warn("Không tìm thấy menu người dùng.");
            return;
        }

        // Tìm mục 'Hộp phim'
        let mucHopPhim = null;
        danhSachMenu.forEach(muc => {
            if (muc.textContent.includes('Hộp phim')) {
                mucHopPhim = muc;
            }
        });

        if (!mucHopPhim) {
            console.warn("Không tìm thấy mục 'Hộp phim'.");
            return;
        }

        // Tạo nút mới
        const nutTaiDanhSach = document.createElement('li');
        const nutTaiDanhSach_a = document.createElement('a');
        nutTaiDanhSach_a.textContent = 'Tải danh sách trong hộp';
        nutTaiDanhSach_a.setAttribute("class", "fa-film")
        nutTaiDanhSach_a.href = '#';
        nutTaiDanhSach_a.style.color = '#00ffcc';

        nutTaiDanhSach_a.onclick = async function (e) {
            e.preventDefault();
            nutTaiDanhSach_a.style.pointerEvents = 'none';
            alert("Đang chuẩn bị tải xuống danh sách phim trong hộp phim, vui lòng không thoát khỏi trang hiện tại cho đến khi hiện thông báo tiếp theo\n\nẤn OK để bắt đầu nhen...")
            const danhSachPhim = await layTatCaPhim();
            if (danhSachPhim.length > 0) {
                const danhSachSapXep = danhSachPhim.sort((a, b) => a.localeCompare(b));
                alert("Đã tổng hợp xong danh sách phim.")
                taiFileDanhSach(danhSachSapXep);
            } else {
                alert('Không tìm thấy tiêu đề phim nào!');
            }

            nutTaiDanhSach_a.style.pointerEvents = 'auto';
        };

        nutTaiDanhSach.appendChild(nutTaiDanhSach_a);
        mucHopPhim.parentNode.insertBefore(nutTaiDanhSach, mucHopPhim.nextSibling);
    }

    // Tải HTML, trả về danh sách tiêu đề nếu hợp lệ
    async function layPhimTrang(url) {
        try {
            const res = await fetch(url);
            const html = await res.text();
            const dom = new DOMParser().parseFromString(html, 'text/html');
            const tieuDes = dom.querySelectorAll('h2.Title');

            if (tieuDes.length === 0) return null;

            return [...tieuDes].map(el => el.textContent.trim());
        } catch (e) {
            console.error("Lỗi khi tải trang:", url);
            return null;
        }
    }

    // Lấy toàn bộ danh sách từ các trang
    async function layTatCaPhim() {
        const tatCaPhim = [];
        let trangHienTai = 1;
        let soLanThatBai = 0;

        while (soLanThatBai < 2) {
            const url = `/tu-phim/trang-${trangHienTai}.html`;
            console.log(`🔍 Đang kiểm tra ${url}...`);

            const danhSachTrang = await layPhimTrang(url);

            if (!danhSachTrang) {
                console.warn(`⚠️ Không tìm thấy phim ở trang ${trangHienTai}.`);
                soLanThatBai++;
            } else {
                console.log(`✅ Trang ${trangHienTai} có ${danhSachTrang.length} phim:`);
                danhSachTrang.forEach((tenPhim, index) => {
                    console.log(`   ${index + 1}. ${tenPhim}`);
                });

                tatCaPhim.push(...danhSachTrang);
                soLanThatBai = 0;
            }

            trangHienTai++;
        }

        return tatCaPhim;
    }

    // Tải xuống danh sách dạng TXT
    function taiFileDanhSach(danhSachTieuDe) {
        const noiDung = danhSachTieuDe.join('\n');
        const blob = new Blob([noiDung], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);

        const theTai = document.createElement('a');
        theTai.href = url;
        theTai.download = 'danhSachAnime-animevietsub.txt';
        document.body.appendChild(theTai);
        theTai.click();
        document.body.removeChild(theTai);
        URL.revokeObjectURL(url);
    }

    // Gọi chèn nút khi trang tải
    chenNutTaiDanhSach();
})();