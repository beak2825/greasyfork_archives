// ==UserScript==
// @name         PW Course Downloader
// @namespace    KorigamiK
// @version      1.0.0
// @description  Download PW course content
// @author       KorigamiK
// @match        https://www.pw.live/*
// @grant        GM_addStyle
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.9.1/jszip.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/524404/PW%20Course%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/524404/PW%20Course%20Downloader.meta.js
// ==/UserScript==
// deno-lint-ignore-file no-window

const API = {
  BASE_URL: "https://api.penpencil.co",
  BATCH_ID: "671f543f10df7bb168d0296a",
  SESSION_TOKEN: /* Paste your session token here */ "Bearer ...",
  async fetch(endpoint) {
    const res = await fetch(`${this.BASE_URL}${endpoint}`, {
      headers: { Authorization: this.SESSION_TOKEN },
    });
    return res.json();
  },

  getBatch: (slug) => API.fetch(`/v3/batches/${slug}/details`),
  getContent: (batchSlug, subjectSlug, type = "videos") =>
    API.fetch(
      `/v2/batches/${batchSlug}/subject/${subjectSlug}/contents?contentType=${type}`,
    ),
  getTests: (subjectId) =>
    API.fetch(
      `/v3/test-service/tests/check-tests?testSource=BATCH_QUIZ&batchId=${API.BATCH_ID}&batchSubjectId=${subjectId}`,
    ),
  getDPPs: (subjectId) =>
    API.fetch(
      `/v3/test-service/tests/dpp?batchId=${API.BATCH_ID}&batchSubjectId=${subjectId}&isSubjective=false`,
    ),
};

const UI = {
  styles: `
      .pw-dl {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.15);
          padding: 15px;
          z-index: 9999;
          width: 300px;
          font-family: system-ui;
      }
      .pw-dl select { width: 100%; margin: 8px 0; padding: 5px; }
      .pw-dl button {
          background: #4CAF50;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          width: 100%;
      }
      .pw-dl .status {
          font-size: 14px;
          color: #666;
          margin-top: 8px;
      }
    `,

  create() {
    // Check if UI already exists
    if (document.querySelector(".pw-dl")) {
      return document.querySelector(".pw-dl");
    }

    GM_addStyle(this.styles);
    const container = document.createElement("div");
    container.className = "pw-dl";
    container.innerHTML = `
            <select multiple size="5"></select>
            <button class="download-selected">Download Selected</button>
            <div class="status"></div>
        `;
    document.body.appendChild(container);
    return container;
  },

  updateStatus(msg) {
    document.querySelector(".pw-dl .status").textContent = msg;
  },
};

class ContentDownloader {
  constructor(batchSlug) {
    if (window.pwDownloaderInstance) {
      return window.pwDownloaderInstance;
    }

    this.batchSlug = batchSlug;
    this.subjects = [];
    this.zip = new JSZip();
    this.init();

    window.pwDownloaderInstance = this;
  }

  async init() {
    const ui = UI.create();
    const select = ui.querySelector("select");

    // Add download all buttons
    ui.querySelector("button").insertAdjacentHTML(
      "beforebegin",
      `
            <div style="display: flex; gap: 8px; margin-bottom: 8px;">
                <button class="download-all">Download All Content</button>
                <button class="download-pdfs">Download All PDFs</button>
            </div>
        `,
    );

    try {
      const { data } = await API.getBatch(this.batchSlug);
      this.subjects = data.subjects;

      select.innerHTML = this.subjects
        .map((s) => `<option value="${s._id}">${s.subject}</option>`)
        .join("");

      ui.querySelector(".download-selected").addEventListener(
        "click",
        () => this.downloadSelected(select),
      );
      ui.querySelector(".download-all").addEventListener(
        "click",
        () => this.downloadAll(),
      );
      ui.querySelector(".download-pdfs").addEventListener(
        "click",
        () => this.downloadAllPDFs(),
      );
    } catch (err) {
      UI.updateStatus("Failed to load subjects");
      console.error(err);
    }
  }

  async downloadSelected(select) {
    const selectedOptions = [...select.selectedOptions];

    if (selectedOptions.length === 0) {
      UI.updateStatus("Please select subjects");
      return;
    }

    const selectedSubjects = selectedOptions
      .map((option) => this.subjects.find((s) => s._id === option.value))
      .filter(Boolean);

    UI.updateStatus(`Processing ${selectedSubjects.length} subjects...`);

    try {
      this.zip = new JSZip();
      const rootFolder = this.zip.folder("PW Selected Subjects");
      let totalPdfs = 0;
      let processedPdfs = 0;
      let totalSize = 0;

      for (const [index, subject] of selectedSubjects.entries()) {
        try {
          UI.updateStatus(
            `Processing ${subject.subject} (${
              index + 1
            }/${selectedSubjects.length})...`,
          );

          const subjectFolder = rootFolder.folder(
            this.sanitizeFileName(subject.subject),
          );
          const content = await this.getSubjectContent(subject);

          // Add content JSON
          const contentJson = JSON.stringify(content, null, 2);
          subjectFolder.file("content.json", contentJson);
          totalSize += contentJson.length;

          // Process PDFs
          if (content.notes?.length) {
            const pdfFolder = subjectFolder.folder("PDFs");
            const pdfs = this.extractPdfLinks(content.notes);
            totalPdfs += pdfs.length;

            if (pdfs.length) {
              const pdfSizes = await this.processPdfs(
                pdfs,
                pdfFolder,
                (processed) => {
                  processedPdfs += processed;
                  UI.updateStatus(
                    `Downloaded ${processedPdfs}/${totalPdfs} PDFs...`,
                  );
                },
              );
              totalSize += pdfSizes.reduce((a, b) => a + b, 0);
            }
          }

          // Check total size
          if (totalSize > 1.5 * 1024 * 1024 * 1024) { // 1.5GB limit
            throw new Error(
              "Content size too large. Try selecting fewer subjects.",
            );
          }
        } catch (error) {
          console.error(`Error processing subject ${subject.subject}:`, error);
          UI.updateStatus(
            `Warning: Some content for ${subject.subject} might be missing`,
          );
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }

      UI.updateStatus("Creating ZIP file... This might take a moment.");

      try {
        const zipBlob = await this.generateZipBlob();
        if (!this.isValidBlob(zipBlob)) {
          throw new Error("Invalid ZIP file generated");
        }

        await this.downloadZip(zipBlob);
        UI.updateStatus("Download complete!");
      } catch (error) {
        throw new Error(`ZIP creation failed: ${error.message}`);
      }
    } catch (error) {
      console.error("Download error:", error);
      UI.updateStatus(
        `Error: ${error.message}. Try downloading fewer subjects.`,
      );
    } finally {
      this.zip = new JSZip();
    }
  }

  async generateZipBlob() {
    return await this.zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      })
  }

  isValidBlob(blob) {
    return blob && blob instanceof Blob && blob.size > 0;
  }

  async processPdfs(pdfs, folder, progressCallback) {
    const chunks = this.chunkArray(pdfs, 3);
    let processedCount = 0;
    const sizes = [];

    for (const chunk of chunks) {
      const chunkPromises = chunk.map(async (pdf) => {
        try {
          const response = await fetch(pdf.url);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const blob = await response.blob();
          folder.file(this.sanitizeFileName(pdf.filename), blob);
          sizes.push(blob.size);
          return true;
        } catch (error) {
          console.error(`Failed to download PDF: ${pdf.filename}`, error);
          return false;
        }
      });

      const results = await Promise.allSettled(chunkPromises);
      const successCount = results.filter((r) =>
        r.status === "fulfilled" && r.value
      ).length;
      processedCount += successCount;
      progressCallback(successCount);

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    return sizes;
  }

  downloadZip(blob) {
    return new Promise((resolve, reject) => {
      try {
        if (!this.isValidBlob(blob)) {
          reject(new Error("Invalid ZIP blob"));
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        const timestamp = new Date().toISOString().split("T")[0];
        a.download = `pw_selected_subjects_${timestamp}.zip`;

        a.onclick = () => {
          setTimeout(() => {
            URL.revokeObjectURL(url);
            resolve();
          }, 1000);
        };

        a.click();
      } catch (error) {
        reject(error);
      }
    });
  }

  extractPdfLinks(notes) {
    const pdfs = [];
    notes.forEach((note) => {
      note.homeworkIds?.forEach((homework) => {
        homework.attachmentIds?.forEach((attachment) => {
          pdfs.push({
            topic: homework.topic,
            url: `${attachment.baseUrl}${attachment.key}`,
            filename: attachment.name,
          });
        });
      });
    });
    return pdfs;
  }

  async downloadAll() {
    UI.updateStatus("Downloading all content...");
    const content = {};

    for (const subject of this.subjects) {
      UI.updateStatus(`Downloading ${subject.subject}...`);
      content[subject.subject] = await this.getSubjectContent(subject);
    }

    this.saveToFile(content, "all_content");
    UI.updateStatus("All content downloaded!");
  }

  async downloadAllPDFs() {
    UI.updateStatus("Gathering PDF links...");
    const pdfs = [];

    // Create main folder in zip
    const rootFolder = this.zip.folder("PW Course PDFs");

    for (const subject of this.subjects) {
      UI.updateStatus(`Processing ${subject.subject}...`);
      const { notes } = await this.getSubjectContent(subject);

      // Create subject folder
      const subjectFolder = rootFolder.folder(
        this.sanitizeFileName(subject.subject),
      );

      notes.forEach((note) => {
        note.homeworkIds?.forEach((homework) => {
          homework.attachmentIds?.forEach((attachment) => {
            pdfs.push({
              subject: subject.subject,
              topic: homework.topic,
              url: `${attachment.baseUrl}${attachment.key}`,
              filename: attachment.name,
              folder: subjectFolder,
            });
          });
        });
      });
    }

    if (pdfs.length === 0) {
      UI.updateStatus("No PDFs found!");
      return;
    }

    UI.updateStatus(`Found ${pdfs.length} PDFs. Starting download...`);

    try {
      await this.downloadAndZipPDFs(pdfs);
    } catch (error) {
      console.error("Error creating ZIP:", error);
      UI.updateStatus("Error creating ZIP file!");
    }
  }

  async downloadAndZipPDFs(pdfs) {
    let completed = 0;

    // Download all PDFs concurrently but with rate limiting
    const chunks = this.chunkArray(pdfs, 5); // Process 5 PDFs at a time

    for (const chunk of chunks) {
      await Promise.all(chunk.map(async (pdf) => {
        try {
          const response = await fetch(pdf.url);
          const blob = await response.blob();

          // Add to appropriate folder in zip
          const safeName = this.sanitizeFileName(pdf.filename);
          pdf.folder.file(safeName, blob);

          completed++;
          UI.updateStatus(`Processing PDFs: ${completed}/${pdfs.length}`);
        } catch (error) {
          console.error(`Failed to process ${pdf.filename}:`, error);
        }
      }));
    }

    UI.updateStatus("Creating ZIP file...");

    // Generate and download ZIP
    const zipBlob = await this.zip.generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6,
      },
    });

    const url = URL.createObjectURL(zipBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pw_course_pdfs_${new Date().toISOString().split("T")[0]}.zip`;
    a.click();
    URL.revokeObjectURL(url);

    // Reset zip for next use
    this.zip = new JSZip();

    UI.updateStatus("All PDFs downloaded in ZIP!");
  }

  // Utility methods
  sanitizeFileName(filename) {
    return filename.replace(/[/\\?%*:|"<>]/g, "-");
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  async getSubjectContent(subject) {
    const [videos, notes, tests, dpps] = await Promise.all([
      API.getContent(this.batchSlug, subject.slug, "videos"),
      API.getContent(this.batchSlug, subject.slug, "notes"),
      API.getTests(subject._id),
      API.getDPPs(subject._id),
    ]);

    return {
      videos: videos.data.map((v) => ({
        title: v.topic,
        url: v.url,
        date: v.date,
        duration: v.videoDetails?.duration,
        teacher: v.teachers?.[0]
          ? `${v.teachers[0].firstName} ${v.teachers[0].lastName}`.trim()
          : "Unknown Teacher",
      })),
      notes: notes.data,
      tests: tests.data,
      dpps: dpps.data,
    };
  }

  saveToFile(data, prefix = "content") {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pw_${prefix}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize only if not already initialized
if (!window.pwDownloaderInstance) {
  new ContentDownloader(
    "crash-course-gate-2025-computer-science-and-it-200846",
  );
}
