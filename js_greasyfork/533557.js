// ==UserScript==
// @name         Replace Node.js Installation Commands on Oracle Node Tutorial
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Replaces old Node.js installation commands with updated ones on Oracle tutorial
// @author       Tvoje ime
// @match        https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/node-on-ol/01oci-ol-node-summary.htm
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533557/Replace%20Nodejs%20Installation%20Commands%20on%20Oracle%20Node%20Tutorial.user.js
// @updateURL https://update.greasyfork.org/scripts/533557/Replace%20Nodejs%20Installation%20Commands%20on%20Oracle%20Node%20Tutorial.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to replace the commands inside the <code> elements
    function replaceCommands() {
        const codeBlocks = document.querySelectorAll('pre code');

        if (codeBlocks.length > 0) {
            // Check and replace the commands if they match the old ones
            codeBlocks.forEach((block) => {
                if (block.textContent.includes('sudo yum update')) {
                    block.textContent = 'sudo dnf module reset nodejs';
                }
                if (block.textContent.includes('sudo yum install -y nodejs')) {
                    block.textContent = 'sudo dnf module enable nodejs:20';
                }
                if (block.textContent.includes('node --version')) {
                    block.textContent = 'sudo dnf install nodejs';
                }
            });
            console.log('Commands updated!');
        }
    }

    // Wait for the page to fully load before running the script
    window.addEventListener('load', function() {
        setTimeout(replaceCommands, 1000);  // Adding a slight delay to make sure the content is rendered
    });

})();



















// ==UserScript==
// @name         Modify Tutorial Instructions for Commands
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify tutorial page to update wget, tar, mv commands, Java installation, and environment variables
// @author       You
// @match        https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get all the elements that may contain the old commands
    var oldCommands = document.querySelectorAll('code'); // assumes commands are inside <code> tags

    oldCommands.forEach(function(element) {
        // Modify wget commands
        if (element.textContent.includes("wget http://apache.mirrors.pair.com/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz")) {
            element.textContent = element.textContent.replace("wget http://apache.mirrors.pair.com/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz",
                "wget https://archive.apache.org/dist/maven/maven-3/3.6.3/binaries/apache-maven-3.6.3-bin.tar.gz");
        }

        // Modify wget commands for Git package
        if (element.textContent.includes("wget https://repo.ius.io/7/x86_64/packages/g/git224-core-2.24.2-1.el7.ius.x86_64.rpm")) {
            element.textContent = element.textContent.replace("wget https://repo.ius.io/7/x86_64/packages/g/git224-core-2.24.2-1.el7.ius.x86_64.rpm",
                "wget https://repo.ius.io/archive/7/x86_64/packages/g/git224-core-2.24.2-1.el7.ius.x86_64.rpm");
        }

        // Modify tar commands
        if (element.textContent.includes("sudo tar xvfz apache-maven-3.6.3-bin.tar.gz")) {
            element.textContent = element.textContent.replace("sudo tar xvfz apache-maven-3.6.3-bin.tar.gz",
                "tar -xvzf apache-maven-3.6.3-bin.tar.gz");
        } else if (element.textContent.includes("tar -xvzf apache-maven-3.6.3-bin.tar.gz")) {
            element.textContent = element.textContent.replace("tar -xvzf apache-maven-3.6.3-bin.tar.gz",
                "tar -xvzf apache-maven-3.6.3-bin.tar.gz");
        }

// Modify mv command
if (element.textContent.includes("sudo mv apache-maven-3.6.3 /opt/")) {
    element.textContent = element.textContent.replace("sudo mv apache-maven-3.6.3 /opt/",
        "sudo mv apache-maven-3.6.3 /opt/maven \n" +
        "sudo yum install maven OR \n" +
        "nano ~/.bashrc \n" +
        "export MAVEN_HOME=/opt/maven/apache-maven-3.6.3\n" +
        "export PATH=$MAVEN_HOME/bin:$PATH \n" +
        "# Ako prva linija ne radi, dodaj ovu liniju u .bashrc\n" +
        "export PATH=$PATH:/opt/apache-maven-3.6.3/bin\n" +
        "source ~/.bashrc");
}



        // Modify Java installation command
        if (element.textContent.includes("sudo yum install java-1.8.0-openjdk-devel")) {
            element.textContent = element.textContent.replace("sudo yum install java-1.8.0-openjdk-devel",
                "sudo yum install java-17-openjdk-devel");
        }

        // Replace Java alternatives and version check with the new instructions
        if (element.textContent.includes("vi ~/.bashrc")) {
            let updatedCommand = `
# Postavljanje JAVA_HOME u .bashrc
vi ~/.bashrc

# Dodaj sljedeći red u .bashrc i sačuvaj fajl
# set JAVA_HOME
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk

# Aktiviranje promjena
source ~/.bashrc

# Provjera da li je JAVA_HOME postavljen ispravno
echo $JAVA_HOME
            `;
            element.textContent = updatedCommand.trim();
        }

        // Add 'cd ~/gs-spring-boot-docker' command below 'git clone' command
        if (element.textContent.includes("git clone http://github.com/spring-guides/gs-spring-boot-docker.git")) {
            let newCommand = `\ncd ~/gs-spring-boot-docker
nano Application.java
find ~ -name "pom.xml"
cd /home/opc/temp/gs-spring-boot-docker/initial`;
            element.textContent += newCommand.trim();
        }

        // Modify 'java -jar target/spring-boot-docker-complete-0.0.1-SNAPSHOT.jar' to 'java -jar target/gs-spring-boot-docker-0.1.0.jar'
        if (element.textContent.includes("java -jar target/gs-spring-boot-docker-0.1.0.jar")) {
            element.textContent = element.textContent.replace("java -jar target/gs-spring-boot-docker-0.1.0.jar",
                "java -jar target/spring-boot-docker-complete-0.0.1-SNAPSHOT.jar");
        }
    });
})();


















// ==UserScript==
// @name         Modify Oracle WordPress Tutorial Instructions
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Modify the Oracle WordPress tutorial page to update the download and extraction commands with the new URL and options
// @author       You
// @match        https://docs.oracle.com/en-us/iaas/developer-tutorials/tutorials/wp-on-ubuntu/01-summary.htm
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Get all the <code> tags (assuming commands are inside <code> tags)
    var oldCommands = document.querySelectorAll('code');

    oldCommands.forEach(function(element) {
        // Find the old wget command and replace it with the new URL
        if (element.textContent.includes("<url-for-download/filename>.tar.gz")) {
            element.textContent = element.textContent.replace("<url-for-download/filename>.tar.gz", "https://wordpress.org/latest.tar.gz");
        }

        // Find the old tar extraction command and replace it with the new format
        if (element.textContent.includes("tar xvfz <download-file-name>.tar.gz")) {
            element.textContent = element.textContent.replace("tar xvfz <download-file-name>.tar.gz", "tar -xzvf latest.tar.gz");
        }

        // Find the old cp command and replace it with the new format
if (element.textContent.includes("cp -R /home/<your-username>/tmp/wordpress/* /var/www/html")) {
    element.textContent = `sudo cp -R /home/ubuntu/tmp/wordpress/* /var/www/html\nsudo cp -R /home/ubuntu/wordpress/* /var/www/html\nsudo cp -R ~/tmp/wordpress/* /var/www/html`;
}


        // Find the old vi wp-config.php command and replace it with sudo vi wp-config.php
        if (element.textContent.includes("vi wp-config.php")) {
            element.textContent = element.textContent.replace("vi wp-config.php", "sudo vi wp-config.php");
        }
    });
})();


