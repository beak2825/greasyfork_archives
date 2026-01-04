class Downloader {
      
      MAX_DOWNLOAD = 5;
      PAUSE_TIME = 1000;
      progress = 0;
      status = false

      constructor({ pause } = {}) {
        if(jsFileDownloader === undefined) {
          throw new Error("Can't make instance");
        }
        
        if(pause) this.PAUSE_TIME = pause;

        let css = document.createElement("style");
        css.innerText = `.downloader-container{background-color:#2f4f4f;width:calc(100% - 12px);max-width:520px;min-height:64px;position:fixed;bottom:10px;left:50%;transform:translateX(-50%);border-radius:8px;padding:.5em .75em;box-shadow:3px 4px 11px 0 #0000003b}.downloader-container .header{display:flex;justify-content:space-between;align-items:center;padding-bottom:.5em;border-bottom:1px solid #e2e2e259}.downloader-container .header h4{font-size:1.25em}.downloader-container .body{padding:.75em 0}.downloader-container .body ul{list-style-type:none;display:flex;flex-direction:column;gap:.25em}.downloader-container .body .file-item{display:flex;justify-content:space-between;gap:4px;background-color:#fff;padding:.25em;border-radius:4px}.downloader-container .body .file-item p{font-size:1em}`;
        document.head.append(css);

        this.urls = []
        this.__makeContainer();
        this.__makeHeader();
        this.__makeBody();
      }

      __makeContainer() {
        this._container = document.createElement("div");
        this._container.classList.add("downloader-container")
      }

      __makeHeader() {
        this._header = document.createElement("div");
        this._header.classList.add("header");
        let title = document.createElement("h4");
        title.innerText = "Downloader";

        this._count_files = document.createElement("p");
        this._count_files.addEventListener("update", (e) => {
          const { current, total } = e.detail;
          this._count_files.innerText = `${current}/${total}`;
        })
        this.updateProgress(0);
        this._header.append(title, this._count_files);

        this._container.append(this._header);
      }

      __makeBody() {
        let body = document.createElement("div");
        body.classList.add("body");

        this.__containerItem = document.createElement("ul");
        this.__containerItem.classList.add("files-containter")

        body.append(this.__containerItem);

        this._container.append(body);
      }

      __makeItem(title) {
        const item = document.createElement("li");
        item.classList.add("file-item");

        const titleContainer = document.createElement("p");
        titleContainer.innerText = title;

        const progress = document.createElement("span");
        progress.innerText = "0%"

        item.append(titleContainer, progress);

        function updateProgress(percent) {
          progress.innerText = `${percent} %`
        }

        return {
          item,
          updateProgress,
        }
      }

      add_url(url, { title } = {}) {
        if(title === undefined) {
          title = `File - ${this.urls.length}`;
        }
        this.urls.push({ url, title })
        this.updateProgress(0)
      }

      add_urls(urls) {
        for(const item of urls) {
          add_url(item.url)
        }
      }

      async __download(url, title) {
        const downloadContainer = document.createElement("li")
        const progressFile = this.__makeItem(title || "File");
        this.__containerItem.append(progressFile.item);
        
        const process = (event) => {
          if (!event.lengthComputable) return; // guard

          var downloadingPercentage = Math.floor(event.loaded / event.total * 100);
          console.log(downloadingPercentage)
          progressFile.updateProgress(downloadingPercentage)
        };

        new jsFileDownloader({ url, process })
        .then(async () => {
          progressFile.updateProgress(100);
          await new Promise(res => setTimeout(() => res(), 500));
          progressFile.item.remove();
          Promise.resolve(true)
        })
        .catch(err => Promise.reject(err))
      }


      async start() {
        if(this.status) return;

        this.progress = 0
        this.updateProgress(this.progress);
        document.body.append(this._container);
        this.status = true;

        let countProgress = 0;
        for(const [key, item] of Object.entries(this.urls)) {
          this.__download(item.url)
          .then(async () => {
            this.progress += 1;
            this.updateProgress(this.progress);
            countProgress -= 1
          })
          .catch(e => {
            countProgress -= 1
            console.error(e)
          })
          
          countProgress += 1;

          while(true) {
            if(countProgress <= 5) break

            await new Promise(res => setTimeout(() => res(), this.PAUSE_TIME))
          }

          console.log("Progress " + key)
        }
      }

      updateProgress(current) {
        const event = new CustomEvent("update", { detail: { current, total: this.urls.length }});
        this._count_files.dispatchEvent(event);
      }
    }
