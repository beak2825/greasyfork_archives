// ==UserScript==
// @name         gitea stl preview
// @namespace    http://tampermonkey.net/
// @version      2025-04-12.2
// @description  gitea stl preview with threejs
// @author       You
// @match        https://gitea/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=undefined.gitea
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532588/gitea%20stl%20preview.user.js
// @updateURL https://update.greasyfork.org/scripts/532588/gitea%20stl%20preview.meta.js
// ==/UserScript==


if(!(location.href.match(/.*\.stl$/)||location.href.match(/\/commit\//))){
    return
}

const url=new URL(location.href)

const s = document.createElement('script');
s.type="importmap";
const threeVersion = '0.160.1';
s.textContent = `
       {
      "imports": {
        "three": "https://cdn.jsdelivr.net/npm/three@${threeVersion}/build/three.module.js",
        "three/examples/jsm/loaders/STLLoader.js": "https://cdn.jsdelivr.net/npm/three@${threeVersion}/examples/jsm/loaders/STLLoader.js",
        "three/examples/jsm/controls/OrbitControls.js": "https://cdn.jsdelivr.net/npm/three@${threeVersion}/examples/jsm/controls/OrbitControls.js"
      }
    }
    `;
document.head.appendChild(s);


const loadThree = () => new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.type="module";

    unsafeWindow.threeRes=resolve

    s.textContent = `
         import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
         import * as THREE from 'three';
         import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

         threeRes({
         OrbitControls,
          THREE,
          STLLoader
         })
    `;
    s.onerror = reject;
    document.head.appendChild(s);
});


function setupScene({THREE,OrbitControls},parent=document.body){
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    parent.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0x404040);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
    directionalLight.position.set(1, 1, 1).normalize(); // Position the light source
    scene.add(ambient, directionalLight);
    camera.position.z = 5;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        //cube.rotation.x += 0.01;
        // cube.rotation.y += 0.01;
        renderer.render(scene, camera);
    }
    animate();

    camera.position.set(0, 0, 100);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    return {scene,controls};
}


async function diffViews(){
    while(!document.body){
        await new Promise(res=>setTimeout(res,10));
    }

    const fileBoxes=[...document.querySelectorAll("#diff-file-boxes .diff-file-box")].filter(b=>b.getAttribute("data-old-filename").endsWith(".stl"));
    const parentCommitLink=[...document.querySelectorAll('a[href*=commit]')].filter(a=>!a.href.includes(url.pathname.split("commit/")[1]))[0]
    const parentCommmit=parentCommitLink.href.split("commit/")[1]

    if(fileBoxes.length){
        const threePr=loadThree()



        for(const filebox of fileBoxes){

            //https://gitea/admin-user-account/model-test/src/commit/9169b6c3f531871969463ef76ee7602204baedd9/reduced-hook.stl
            const urlOld=new URL(url)
            urlOld.pathname=urlOld.pathname.replace(/\/commit\/.*(\/|$)/,`/raw/commit/${parentCommmit}`)
            urlOld.pathname+="/"+filebox.getAttribute("data-old-filename")

            const newUrl=new URL(location.href.replace(/\/commit\//,`/raw/commit/`))
            newUrl.pathname+="/"+filebox.getAttribute("data-new-filename")


            threePr.then(async (api)=>{
                const {scene,controls}= setupScene(api,filebox)
                const THREE=api.THREE;
                const loader = new api.STLLoader();

                let oldRes
                const oldPr=new Promise(res=>{
                oldRes=res;
                })
                let newRes
                const newPr=new Promise(res=>{
                newRes=res;
                })

                loader.load(urlOld.href, function (geometry) {
                     const material = new THREE.MeshPhongMaterial({ color: "red" });
                     const mesh = new THREE.Mesh(geometry, material);

                     geometry.computeBoundingBox();
                     const center = geometry.boundingBox.getCenter(new THREE.Vector3());
                     mesh.geometry.center(); // Center the model
                     mesh.scale.set(0.5, 0.5, 0.5);
                     const bbox = geometry.boundingBox;
                     const size = new THREE.Vector3();
                     bbox.getSize(size);
                     const maxDim = Math.max(size.x, size.y, size.z);

                     // Position mesh in front of the camera
                     mesh.position.z = -maxDim * -0.1;
                     mesh.position.x = -80

                     scene.add(mesh);

                     controls.target.copy(mesh.position);  // Make controls orbit around the mesh
                     controls.update();

                     oldRes(mesh.position);
                 });
                loader.load(newUrl.href, function (geometry) {
                     const material = new THREE.MeshPhongMaterial({ color: "green" });
                     const mesh = new THREE.Mesh(geometry, material);

                     geometry.computeBoundingBox();
                     const center = geometry.boundingBox.getCenter(new THREE.Vector3());
                     mesh.geometry.center(); // Center the model
                     mesh.scale.set(0.5, 0.5, 0.5);
                     const bbox = geometry.boundingBox;
                     const size = new THREE.Vector3();
                     bbox.getSize(size);
                     const maxDim = Math.max(size.x, size.y, size.z);

                     // Position mesh in front of the camera
                     mesh.position.z = -maxDim * -0.1;
                     mesh.position.x = 80

                     scene.add(mesh);

                     controls.target.copy(mesh.position);  // Make controls orbit around the mesh
                     controls.update();

                     newRes(mesh.position);
                 });

                const positions=await Promise.all([oldPr,newPr])
                controls.target.copy(new THREE.Vector3().addVectors(...positions).multiplyScalar(0.5));
                controls.update();
            })
        }

    }

}


if(location.href.match(/\/commit\//)){

    diffViews();
    return;
}else{
    loadThree().then(async (api)=>{
        const {scene,controls}= setupScene(api)
        const THREE=api.THREE;
        const loader = new api.STLLoader();
        loader.load(location.href.replace("/src/","/raw/"), function (geometry) {
            const material = new THREE.MeshPhongMaterial({ color: 0x2194ce });
            const mesh = new THREE.Mesh(geometry, material);

            geometry.computeBoundingBox();
            const center = geometry.boundingBox.getCenter(new THREE.Vector3());
            mesh.geometry.center(); // Center the model
            mesh.scale.set(0.5, 0.5, 0.5);
            const bbox = geometry.boundingBox;
            const size = new THREE.Vector3();
            bbox.getSize(size);
            const maxDim = Math.max(size.x, size.y, size.z);

            // Position mesh in front of the camera
            mesh.position.z = -maxDim * 0.6;

            scene.add(mesh);

            controls.target.copy(mesh.position);  // Make controls orbit around the mesh
            controls.update();
        });
    })

}
/*
*/